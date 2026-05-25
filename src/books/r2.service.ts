import { Injectable } from "@nestjs/common";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { ConfigService } from "@nestjs/config";
import { Multer } from 'multer'
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { DeleteObjectCommand } from '@aws-sdk/client-s3';

@Injectable()
export class R2Service {

    private client;

    constructor(private readonly configService: ConfigService) {
        this.client = new S3Client({
            region: 'auto',
            endpoint: `https://${this.configService.get<string>('r2.account_id')}.r2.cloudflarestorage.com`,
            credentials: {
                accessKeyId: this.configService.get<string>('r2.access_key_id')!,
                secretAccessKey: this.configService.get<string>('r2.secret_access_key')!
            }
        })
    }

    async uploadFile(file: Express.Multer.File) {
        const key = `${Date.now()}-${file.originalname}`;

        await this.client.send(
            new PutObjectCommand({
                Bucket: this.configService.get<string>('r2.bucket_name'),
                Key: key,
                Body: file.buffer,
                ContentType: file.mimetype,
            })
        )

        // const publicUrl = `${this.configService.get<string>('r2.public_url')}/${key}`
        return key;
    }

    async getSignedUrl(key: string) {
        const command = new GetObjectCommand({
            Bucket: this.configService.get<string>('r2.bucket_name'),
            Key: key,
        });

        const url = await getSignedUrl(this.client, command, {
            expiresIn: 60 * 5, // 5 minutes
        });

        return url;
    }

    async deleteFile(key: string) {
        await this.client.send(
            new DeleteObjectCommand({
                Bucket: process.env.R2_BUCKET_NAME,
                Key: key,
            }),
        );
    }
}
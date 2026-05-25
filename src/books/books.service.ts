import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { R2Service } from './r2.service';

@Injectable()
export class BooksService {
    constructor(
        private prisma: PrismaService,
        private r2Service: R2Service,
    ) { }

    async createBook(body: any, file: Express.Multer.File, user: any) {
        // const coverUrl = await this.r2Service.uploadFile(file);
        const coverKey = await this.r2Service.uploadFile(file);

        return this.prisma.book.create({
            data: {
                title: body.title,
                author: body.author,
                description: body.description,
                coverKey,
                userId: user.userId,
            },
        });
    }

    async findOne(id: string) {
        const book = await this.prisma.book.findUnique({
            where: { id },
        });

        const signedUrl = await this.r2Service.getSignedUrl(book?.coverKey!);

        return {
            ...book,
            coverUrl: signedUrl,
        };
    }

    async getBooks() {
        const books = await this.prisma.book.findMany();

        return Promise.all(
            books.map(async (book) => {
                const signedUrl = await this.r2Service.getSignedUrl(book.coverKey!);

                return {
                    ...book,
                    coverUrl: signedUrl,
                };
            }),
        );
    }

    async deleteBook(id: string) {
        const book = await this.prisma.book.findUnique({
            where: { id },
        });

        if (!book) return null;

        await this.r2Service.deleteFile(book.coverKey!);

        return this.prisma.book.delete({
            where: { id },
        });
    }
}

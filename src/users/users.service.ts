import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
    constructor(
        private readonly prisma: PrismaService
    ) { }

    async findUsers() {
        return await this.prisma.user.findMany();
    }

    async createUser(dto: CreateUserDto) {
        const hashedPass = await bcrypt.hash(dto.password, 10);
        return this.prisma.user.create({ data: { ...dto, password: hashedPass } })
    }

    async removeUser(id: string) {
        await this.prisma.user.delete({ where: { id } })
        return { deleted: true }
    }

    async findUserByEmail(email: string) {
        return await this.prisma.user.findUnique({
            where: { email }
        })
    }

    async findUserById(id: string) {
        return await this.prisma.user.findUnique({
            where: { id }
        })
    }

    async updateRefreshToken(userId: string, token: string) {
        const hashedRefreshToken = await bcrypt.hash(token, 10)
        return this.prisma.user.update({
            where: { id: userId },
            data: { refreshToken: hashedRefreshToken }
        })
    }
}

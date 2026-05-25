import { Injectable } from '@nestjs/common';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService
    ) { }

    async validateUser(email: string, pass: string) {
        const user = await this.usersService.findUserByEmail(email);
        if (user && (await bcrypt.compare(pass, user.password))) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }

    async login(user: any) {
        const payload = { sub: user.id, email: user.email };

        const accessToken = this.jwtService.sign(payload, { expiresIn: '15m' })
        const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' })

        await this.usersService.updateRefreshToken(user.id, refreshToken);
        return {
            accessToken,
            refreshToken
        }
    }

    async refreshToken(token: string) {
        try {
            const payload = this.jwtService.verify(token);
            const user = await this.usersService.findUserById(payload.sub);

            if (!user || !user.refreshToken|| !(await bcrypt.compare(token, user.refreshToken))) {
                throw new UnauthorizedException("Invalid or expired token")
            }
            return this.login(user);
        } catch {
            throw new UnauthorizedException("Invalid or expired token")
        }
    }
}

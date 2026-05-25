import { Controller, Post, Body, Request, UseGuards, Res, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { type Response, type Request as ExpressRequest } from 'express';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @UseGuards(LocalAuthGuard)
    @Post('login')
    async login(@Request() req, @Res({ passthrough: true }) res: Response) {
        const tokens = await this.authService.login(req.user);

        res.cookie('refreshToken', tokens.refreshToken, {
            httpOnly: true,
            sameSite: 'strict',
            secure: false, // true in prod
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        return {
            accessToken: tokens.accessToken
        }
    }

    @Post('refresh')
    refresh(@Req() req: ExpressRequest) {
        const refreshToken = req.cookies.refreshToken;
        return this.authService.refreshToken(refreshToken)
    }
}

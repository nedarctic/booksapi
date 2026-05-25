import { AuthGuard } from "@nestjs/passport";
import { Injectable, UnauthorizedException } from "@nestjs/common";

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {

    handleRequest(err, user, info, context) {
        const request = context.switchToHttp().getRequest();

        const authHeader = request.headers.authorization;

        if (!authHeader) {
            throw new UnauthorizedException({
                error: 'NO_TOKEN',
                message: 'Access token missing',
            });
        }

        
        if (info?.name === 'TokenExpiredError') {
            throw new UnauthorizedException({
                error: 'TOKEN_EXPIRED',
                message: 'Access token expired',
            });
        }

        
        if (err || info || !user) {
            throw new UnauthorizedException({
                error: 'INVALID_TOKEN',
                message: 'Invalid token',
            });
        }

        return user;
    }
}
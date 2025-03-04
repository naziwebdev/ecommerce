import { CanActivate, ExecutionContext, Injectable, Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService, 
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const authorizationHeader = request.headers.authorization;
    if (!authorizationHeader) {
      return false;
    }

    const token = authorizationHeader.split(' ')[1];
    if (!token) {
      return false;
    }

    try {
      const secretKey = this.configService.get<string>('JWT_SECRET_KEY');
      const user = this.jwtService.verify(token, { secret: secretKey });
      return user.userId
    } catch (error) {
      console.error('JWT Verification Error:', error.message);
      return false;
    }
  }
}

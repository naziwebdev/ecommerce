import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from 'src/users/users.module';
import { RefreshStrategy } from './strategies/refresh.strategy';
import { CurrentUserMiddleware } from 'src/middlewares/current-user.middleware';
import { MiddlewareConsumer } from '@nestjs/common';

@Module({
  imports: [UsersModule, PassportModule, JwtModule.register({})],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    RefreshStrategy,
    {
      provide: 'JWT_SECRET_KEY',
      useFactory: (configService: ConfigService) =>
        configService.get('JWT_SECRET_KEY'),
      inject: [ConfigService],
    },
    {
      provide: 'JWT_EXPIRESIN',
      useFactory: (configService: ConfigService) =>
        configService.get('JWT_EXPIRESIN'),
      inject: [ConfigService],
    },
    {
      provide: 'REFRESH_SECRET_KEY',
      useFactory: (configService: ConfigService) =>
        configService.get('REFRESH_SECRET_KEY'),
      inject: [ConfigService],
    },
    {
      provide: 'REFRESH_EXPIRESIN',
      useFactory: (configService: ConfigService) =>
        configService.get('REFRESH_EXPIRESIN'),
      inject: [ConfigService],
    },
  ],
})
export class AuthModule {
    //set middleware global for all routes
    configure(consumer: MiddlewareConsumer) {
      consumer.apply(CurrentUserMiddleware).forRoutes('*');
    }
}

import {
  Controller,
  Body,
  Post,
  Res,
  HttpStatus,
  UseGuards,
  Get,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/users/dtos/create-user.dto';
import { loginDto } from './dtos/login.dto';
import { Response } from 'express';
import { GetUser } from 'src/decorators/get-user.decorator';
import { JwtAuthGuard } from 'src/guards/auth.guard';
import { plainToClass } from 'class-transformer';
import { User } from 'src/users/entities/user.entity';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  async register(@Body() body: CreateUserDto, @Res() res: Response) {
    const { accessToken, refreshToken, user } =
      await this.authService.register(body);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    return res.status(HttpStatus.CREATED).json({
      data: { accessToken, user },
      statusCode: HttpStatus.CREATED,
      message: 'user registered successfully',
    });
  }

  @Post('/login')
  async login(@Body() body: loginDto, @Res() res: Response) {
    const { accessToken, refreshToken, user } = await this.authService.login(
      body.phone,
      body.password,
    );

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    return res.status(HttpStatus.OK).json({
      data: { accessToken, user },
      statusCode: HttpStatus.OK,
      message: 'user login successfully',
    });
  }

  @Get('/me')
  @UseGuards(JwtAuthGuard)
  getMe(@GetUser() user: User, @Res() res: Response) {
    const mainUser = plainToClass(User, user);
    return res.status(HttpStatus.OK).json({
      data: mainUser,
      statusCode: HttpStatus.OK,
      message: 'user data send successfully',
    });
  }
}

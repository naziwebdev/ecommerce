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
import { AuthGuard } from 'src/guards/auth.guard';
import { plainToClass } from 'class-transformer';
import { User } from 'src/users/entities/user.entity';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  async register(@Body() body: CreateUserDto, @Res() res: Response) {
    const newUser = await this.authService.register(body);

    return res.status(HttpStatus.CREATED).json({
      data: newUser,
      statusCode: HttpStatus.CREATED,
      message: 'user registered successfully',
    });
  }

  @Post('/login')
  async login(@Body() body: loginDto, @Res() res: Response) {
    const user = await this.authService.login(body.phone, body.password);

    return res.status(HttpStatus.OK).json({
      data: user,
      statusCode: HttpStatus.OK,
      message: 'user login successfully',
    });
  }

  @Get('/me')
  @UseGuards(AuthGuard)
  getMe(@GetUser() user: User, @Res() res: Response) {
    const mainUser = plainToClass(User, user);
    return res.status(HttpStatus.OK).json({
      data: mainUser,
      statusCode: HttpStatus.OK,
      message: 'user data send successfully',
    });
  }
}

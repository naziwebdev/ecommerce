import {
  Injectable,
  Inject,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { CreateUserDto } from 'src/users/dtos/create-user.dto';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { User } from 'src/users/entities/user.entity';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    @Inject('JWT_SECRET_KEY') private readonly jwtSecret: string,
    @Inject('JWT_EXPIRESIN') private readonly jwtExpiresIn: string,
    @Inject('REFRESH_SECRET_KEY') private readonly refreshSecret: string,
    @Inject('REFRESH_EXPIRESIN') private readonly refreshExpiresIn: string,
  ) {}

  async register(createUserDto: CreateUserDto) {
    const existUser = await this.usersService.findByPhone(createUserDto.phone);
    if (existUser) {
      throw new ConflictException('user exist already');
    }

    const hashedPassword = await this.usersService.hashPassword(
      createUserDto.password,
    );

    const user = await this.usersService.create(createUserDto, hashedPassword);

    const accessToken = this.jwtService.sign(
      {
        userId: user.id,
        username: user.username,
      },
      {
        secret: this.jwtSecret,
        expiresIn: this.jwtExpiresIn,
      },
    );
    const refreshToken = this.jwtService.sign(
      {
        userId: user.id,
        username: user.username,
      },
      {
        secret: this.refreshSecret,
        expiresIn: this.refreshExpiresIn,
      },
    );

    return { accessToken, refreshToken, user: plainToInstance(User, user) };
  }

  async login(phone: string, password: string) {
    const user = await this.usersService.findByPhone(phone);
    if (!user) {
      throw new NotFoundException('phone or password is incorrect');
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      throw new NotFoundException('phone or password is incorrect');
    }

    const accessToken = this.jwtService.sign(
      {
        userId: user.id,
        username: user.username,
      },
      {
        secret: this.jwtSecret,
        expiresIn: this.jwtExpiresIn,
      },
    );

    const refreshToken = this.jwtService.sign(
      {
        userId: user.id,
        username: user.username,
      },
      {
        secret: this.refreshSecret,
        expiresIn: this.refreshExpiresIn,
      },
    );

    return { accessToken, refreshToken, user: plainToInstance(User, user) };
  }

}

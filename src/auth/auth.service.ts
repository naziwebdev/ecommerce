import { Injectable, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { CreateUserDto } from 'src/users/dtos/create-user.dto';
import {ConfigService} from '@nestjs/config'


@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService:ConfigService
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

    const accessToken = this.jwtService.sign({
      userId: user.id,
      username: user.username,
    },{
        secret:this.configService.get('JWT_SECRET_KEY'),
        expiresIn:this.configService.get('JWT_EXPIRESIN')
    });

    return accessToken
  }
}

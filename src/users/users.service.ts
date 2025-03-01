import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserRoleEnum } from './enums/user-role-enum';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { ChangePasswordDto } from './dtos/change-password.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  private readonly salt = 10;

  constructor(
    @InjectRepository(User)
    private usersRipository: Repository<User>,
  ) {}

  async checkExistUser(phone: string) {
    const user = await this.usersRipository.findOne({ where: { phone } });
    return user;
  }

  async hashPassword(password: string) {
    const hashedPassword = bcrypt.hash(password, this.salt);
    return hashedPassword;
  }

  async create(
    createUserDto: CreateUserDto,
    hashedPassword: string,
    usersCount: number,
  ) {
    const newUser = await this.usersRipository.create({
      ...createUserDto,
      password: hashedPassword,
      role: usersCount > 0 ? UserRoleEnum.USER : UserRoleEnum.ADMIN,
    });

    return newUser;
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserRoleEnum } from './enums/user-role-enum';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { plainToInstance } from 'class-transformer';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  private readonly salt = 10;

  constructor(
    @InjectRepository(User)
    private usersRipository: Repository<User>,
  ) {}

  async findByPhone(phone: string) {
    const user = await this.usersRipository.findOne({ where: { phone } });
    return user;
  }

  async findById(id: number) {
    const user = await this.usersRipository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('not found user');
    }
    return user;
  }

  async hashPassword(password: string) {
    const hashedPassword = bcrypt.hash(password, this.salt);
    return hashedPassword;
  }

  async create(createUserDto: CreateUserDto, hashedPassword: string) {
    const usersCount = await this.usersRipository.count();
    const newUser = await this.usersRipository.create({
      ...createUserDto,
      password: hashedPassword,
      role: usersCount > 0 ? UserRoleEnum.USER : UserRoleEnum.ADMIN,
    });

    return this.usersRipository.save(newUser);
  }

  async update(updateUserDto: UpdateUserDto, id: number) {
    const user = await this.findById(id);

    if (!user) {
      throw new NotFoundException('not found user');
    }

    user.username = updateUserDto.username;

    const updatedUser = await this.usersRipository.save(user);

    return plainToInstance(User, updateUserDto);
  }

  async findAll(limit: number = 2, page: number = 1) {
    const users = await this.usersRipository.find({
      take: limit,
      skip: (page - 1) * limit,
    });

    const allUser = users.map((user) => plainToInstance(User, user));

    return allUser;
  }

  async changePassword(password:string,id:number){

    const user = await this.usersRipository.findOne({where:{id}})
    if(!user){
      throw new NotFoundException('user not found')
    }

    const hashedPassword =await this.hashPassword(password)
    user.password = hashedPassword

    const confirmUser = await this.usersRipository.save(user)
    return plainToInstance(User,confirmUser)

  }
}

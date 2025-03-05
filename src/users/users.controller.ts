import {
  Controller,
  Get,
  Res,
  UseGuards,
  Query,
  HttpStatus,
  Put,
  Body,
  Param,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { Response } from 'express';
import { JwtAuthGuard } from 'src/guards/auth.guard';
import { RoleGuard } from 'src/guards/role.guard';
import { UpdateUserDto } from './dtos/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/')
  @UseGuards(JwtAuthGuard, RoleGuard)
  async findAll(
    @Query('limit') limit: string,
    @Query('page') page: string,
    @Res() res: Response,
  ) {
    const users = await this.usersService.findAll(
      parseInt(limit),
      parseInt(page),
    );
    return res.status(HttpStatus.OK).json({
      data: users,
      statusCode: HttpStatus.OK,
      message: 'users get successfully',
    });
  }

  @Put('/:id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Body() body: UpdateUserDto,
    @Param('id') id: string,
    @Res() res: Response,
  ) {
    const updatedUser = await this.usersService.update(body, parseInt(id));

    return res.status(HttpStatus.OK).json({
      data: updatedUser,
      statusCode: HttpStatus.OK,
      message: 'user updated successfully',
    });
  }
}

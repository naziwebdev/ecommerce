import {
  Body,
  Controller,
  Post,
  UseGuards,
  Res,
  HttpStatus,
  Get,
} from '@nestjs/common';
import { AddressesService } from './addresses.service';
import { JwtAuthGuard } from 'src/guards/auth.guard';
import { CreateAddressDto } from './dtos/create-address.dto';
import { Response } from 'express';
import { GetUser } from 'src/decorators/get-user.decorator';
import { User } from 'src/users/entities/user.entity';

@Controller('addresses')
export class AddressesController {
  constructor(private readonly addressesService: AddressesService) {}

  @Post('/')
  @UseGuards(JwtAuthGuard)
  async create(
    @Body() body: CreateAddressDto,
    @GetUser() user: User,
    @Res() res: Response,
  ) {
    const address = await this.addressesService.create(body, user);

    return res.status(HttpStatus.CREATED).json({
      data: address,
      statusCode: HttpStatus.CREATED,
      message: 'address created successfully',
    });
  }

  @Get('/')
  @UseGuards(JwtAuthGuard)
  async findUserAddresses(@GetUser() user: User, @Res() res: Response) {
    const addresses = await this.addressesService.findUserAddresses(user);

    return res.status(HttpStatus.OK).json({
      data: addresses,
      statusCode: HttpStatus.OK,
      message: 'addresses get successfully',
    });
  }
}

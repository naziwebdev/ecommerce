import {
  Body,
  Controller,
  Post,
  UseGuards,
  Res,
  HttpStatus,
  Get,
  Put,
  Param,
  Delete,
} from '@nestjs/common';
import { AddressesService } from './addresses.service';
import { JwtAuthGuard } from 'src/guards/auth.guard';
import { CreateAddressDto } from './dtos/create-address.dto';
import { Response } from 'express';
import { GetUser } from 'src/decorators/get-user.decorator';
import { User } from 'src/users/entities/user.entity';
import { UpdateAddressDto } from './dtos/update-address.dto';

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

  @Get('/:id')
  @UseGuards(JwtAuthGuard)
  async findOne(
    @Param('id') id: string,
    @Res() res: Response,
  ) {
    const addresse = await this.addressesService.findOne(parseInt(id));

    return res.status(HttpStatus.OK).json({
      data: addresse,
      statusCode: HttpStatus.OK,
      message: 'addresses get successfully',
    });
  }

  @Put('/:id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Body() body: UpdateAddressDto,
    @GetUser() user: User,
    @Param('id') id: string,
    @Res() res: Response,
  ) {
    const addresse = await this.addressesService.update(
      body,
      parseInt(id),
      user,
    );

    return res.status(HttpStatus.OK).json({
      data: addresse,
      statusCode: HttpStatus.OK,
      message: 'addresses updated successfully',
    });
  }

  @Delete('/:id')
  @UseGuards(JwtAuthGuard)
  async remove(
    @GetUser() user: User,
    @Param('id') id: string,
    @Res() res: Response,
  ) {
    const addresse = await this.addressesService.remove(parseInt(id), user);

    return res.status(HttpStatus.OK).json({
      data: addresse,
      statusCode: HttpStatus.OK,
      message: 'addresses removed successfully',
    });
  }
}

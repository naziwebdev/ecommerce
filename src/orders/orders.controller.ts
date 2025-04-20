import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Put,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { GetUser } from 'src/decorators/get-user.decorator';
import { User } from 'src/users/entities/user.entity';
import { JwtAuthGuard } from 'src/guards/auth.guard';
import { Response } from 'express';
import { UpdateOrderDto } from './dtos/update-order.dto';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get('/')
  @UseGuards(JwtAuthGuard)
  async getUserCart(
    @GetUser() user: User,
    @Query('page') page: string,
    @Query('limit') limit: string,
    @Res() res: Response,
  ) {
    const cartItems = await this.ordersService.getUserOrders(
      parseInt(page),
      parseInt(limit),
      user,
    );

    return res.status(HttpStatus.OK).json({
      data: cartItems,
      statusCode: HttpStatus.OK,
      message: 'cartItems send successfully',
    });
  }

  @Put('/:id')
  @UseGuards(JwtAuthGuard)
  async changeStatusOrder(
    @GetUser() user: User,
    @Param('id') id: string,
    @Body() body: UpdateOrderDto,
    @Res() res: Response,
  ) {
    const order = await this.ordersService.changeStatusOrder(
      body,
      user,
      parseInt(id),
    );

    return res.status(HttpStatus.OK).json({
      data: order,
      statusCode: HttpStatus.OK,
      message: 'cartItems send successfully',
    });
  }
}

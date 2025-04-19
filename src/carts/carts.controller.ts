import {
  Controller,
  UseGuards,
  Body,
  Res,
  Post,
  Get,
  HttpStatus,
} from '@nestjs/common';
import { CartService } from './carts.service';
import { JwtAuthGuard } from 'src/guards/auth.guard';
import { GetUser } from 'src/decorators/get-user.decorator';
import { CreateCartItemDto } from './dtos/create-cartItem.dto';
import { User } from 'src/users/entities/user.entity';
import { Response } from 'express';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post('/')
  @UseGuards(JwtAuthGuard)
  async create(
    @Body() body: CreateCartItemDto,
    @GetUser() user: User,
    @Res() res: Response,
  ) {
    const cartItems = await this.cartService.add(body, user);

    return res.status(HttpStatus.CREATED).json({
      data: cartItems,
      statusCode: HttpStatus.CREATED,
      message: 'cartItems added successfully',
    });
  }

  @Get('/')
  @UseGuards(JwtAuthGuard)
  async getUserCart(@GetUser() user: User, @Res() res: Response) {
    const cartItems = await this.cartService.getUserCart(user);

    return res.status(HttpStatus.OK).json({
      data: cartItems,
      statusCode: HttpStatus.OK,
      message: 'cartItems send successfully',
    });
  }
}

import { Controller } from '@nestjs/common';
import { CartService } from './carts.service';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}
}

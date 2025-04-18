import { Module } from '@nestjs/common';
import { CartService } from './carts.service';
import { CartController } from './carts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cart } from './entities/cart.entity';
import { ProductsModule } from 'src/products/products.module';
import { CartItem } from './entities/cartItem.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Cart,CartItem]),ProductsModule],
  controllers: [CartController],
  providers: [CartService],
})
export class CartModule {}

import { Module } from '@nestjs/common';
import { CartService } from './carts.service';
import { CartController } from './carts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cart } from './entities/cart.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Cart])],
  controllers: [CartController],
  providers: [CartService],
})
export class CartModule {}

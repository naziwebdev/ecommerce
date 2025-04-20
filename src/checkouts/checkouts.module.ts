import { Module } from '@nestjs/common';
import { CheckoutsService } from './checkouts.service';
import { CheckoutsController } from './checkouts.controller';
import { Checkout } from './entities/checkout.entity';
import { CheckoutItem } from './entities/checkoutItem.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersModule } from 'src/orders/orders.module';
import { AddressesModule } from 'src/addresses/addresses.module';
import { Cart } from 'src/carts/entities/cart.entity';
import { CartItem } from 'src/carts/entities/cartItem.entity';
import { CartModule } from 'src/carts/carts.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Checkout, CheckoutItem,Cart,CartItem]),
    OrdersModule,
    AddressesModule,
  ],
  controllers: [CheckoutsController],
  providers: [CheckoutsService],
})
export class CheckoutsModule {}

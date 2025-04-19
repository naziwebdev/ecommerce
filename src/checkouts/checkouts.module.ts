import { Module } from '@nestjs/common';
import { CheckoutsService } from './checkouts.service';
import { CheckoutsController } from './checkouts.controller';
import { Checkout } from './entities/checkout.entity';
import { CheckoutItem } from './entities/checkoutItem.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersModule } from 'src/orders/orders.module';

@Module({
  imports: [TypeOrmModule.forFeature([Checkout, CheckoutItem]), OrdersModule],
  controllers: [CheckoutsController],
  providers: [CheckoutsService],
})
export class CheckoutsModule {}

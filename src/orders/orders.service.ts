import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/orderItem.entity';
import { User } from 'src/users/entities/user.entity';
import { Address } from 'src/addresses/entities/address.entity';
import { StatusOrderEnum } from './enums/status-enum';
import { Product } from 'src/products/entities/product.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private orderItemsRepository: Repository<OrderItem>,
  ) {}

  async createOrder(
    totalPrice: number,
    authourity: string,
    user: User,
    address: Address,
  ) {
    const newOrder = await this.ordersRepository.create({
      address,
      user,
      authourity,
      totalPrice,
      status: StatusOrderEnum.PENDDING,
    });

    return await this.ordersRepository.save(newOrder);
  }
  async createOrderItem(
    quantity: number,
    priceAtAddingTime: number,
    order: Order,
    product: Product,
  ) {
    const newOrderItem = await this.orderItemsRepository.create({
      quantity,
      priceAtAddingTime,
      order,
      product,
    });

    return await this.ordersRepository.save(newOrderItem);
  }
}

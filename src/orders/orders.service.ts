import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/orderItem.entity';
import { User } from 'src/users/entities/user.entity';
import { Address } from 'src/addresses/entities/address.entity';
import { StatusOrderEnum } from './enums/status-enum';
import { Product } from 'src/products/entities/product.entity';
import { UpdateOrderDto } from './dtos/update-order.dto';

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
    authority: string,
    user: User,
    address: Address,
  ) {
    const newOrder = await this.ordersRepository.create({
      address,
      user,
      authority,
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

    return await this.orderItemsRepository.save(newOrderItem);
  }

  async getUserOrders(page: number = 1, limit: number = 2, user: User) {
    const userId = user.id;
    const [orders, total] = await this.ordersRepository
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.orderItems', 'orderItems')
      .where('order.userId = :userId', { userId })
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return { orders, total };
  }

  async findByAuthority(authority: string) {
    const order = await this.ordersRepository.findOne({
      where: { authority },
    });

    return order;
  }

  async changeStatusOrder(status: UpdateOrderDto, user: User, id: number) {
    const order = await this.ordersRepository.findOne({
      where: { id, user: { id: user.id } },
    });
    if (!order) {
      throw new Error('Order not found or does not belong to the user.');
    }
    await this.ordersRepository.update(id, { status: status.status });
    return await this.ordersRepository.findOne({ where: { id } });
  }
}

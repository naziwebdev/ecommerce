import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';

import { Address } from 'src/addresses/entities/address.entity';
import { StatusOrderEnum } from '../enums/status-enum';
import { User } from 'src/users/entities/user.entity';
import { OrderItem } from './orderItem.entity';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: StatusOrderEnum,
    default: StatusOrderEnum.PENDDING,
  })
  status: StatusOrderEnum;

  @Column({ type: 'decimal', nullable: false, default: 0 })
  totalPrice: number;

  @Column({nullable: false, unique: true })
  authority: string;

  @ManyToOne(() => Address, (address) => address.orders)
  @JoinColumn()
  address: Address;

  @ManyToOne(() => User, (user) => user.orders)
  @JoinColumn()
  user: User;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.order)
  @JoinColumn()
  orderItems: OrderItem[];

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;
}

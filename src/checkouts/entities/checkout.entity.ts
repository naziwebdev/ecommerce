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
  import { User } from 'src/users/entities/user.entity';
  import { CheckoutItem } from './checkoutItem.entity';
  
  @Entity('checkouts')
  export class Checkout {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column({ type: 'decimal', nullable: false, default: 0 })
    totalPrice: number;
  
    @Column({ type: 'string', nullable: false, unique: true })
    authourity: string;
  
    @ManyToOne(() => Address, (address) => address.checkouts)
    @JoinColumn()
    address: Address;
  
    @ManyToOne(() => User, (user) => user.checkouts)
    @JoinColumn()
    user: User;
  
    @OneToMany(() => CheckoutItem, (checkoutItem) => checkoutItem.checkout)
    @JoinColumn()
    checkoutItems: CheckoutItem[];
  
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
  
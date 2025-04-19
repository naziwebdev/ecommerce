import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
  } from 'typeorm';
  
import { Checkout } from './checkout.entity';
import { Product } from 'src/products/entities/product.entity';
  
  @Entity('checkout_items')
  export class CheckoutItem {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column({ type: 'int', default: 1, nullable: false })
    quantity: number;
  
    @Column({ type: 'decimal', nullable: false })
    priceAtPurchaseTime: number;
  
    @ManyToOne(() => Checkout, (checkout) => checkout.checkoutItems)
    checkout: Checkout;
  
    @ManyToOne(() => Product, (product) => product.checkoutItems)
    product: Product;
  
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
  
import { Column, PrimaryGeneratedColumn, Entity, ManyToOne } from 'typeorm';
import { User } from 'src/users/entities/user.entity';

@Entity({ name: 'addresses' })
export class Address {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  province: string;

  @Column({ nullable: false })
  city: string;

  @Column({ nullable: false })
  address: string;

  @Column({ nullable: true })
  recieverPhone: string;

  @Column({ nullable: true })
  description: string;

  @Column({ type: 'jsonb', nullable: false })
  location: {
    lat: number;
    lng: number;
    [key: string]: any;
  };

  @Column({ nullable: false, length: 10 })
  postalCode: string;

  @Column({ nullable: false })
  block: number;

  @Column({ nullable: false })
  floor: number;

  @ManyToOne(() => User, (user) => user.addresses)
  user: User;
}

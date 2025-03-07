import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

//embeded
@Entity()
export class Location {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'float', nullable: false })
  lng: number;

  @Column({ type: 'float', nullable: false })
  lat: number;
}

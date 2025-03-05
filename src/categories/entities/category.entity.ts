import { Column , PrimaryGeneratedColumn , Entity , OneToMany } from "typeorm";
import { Product } from "src/products/entities/product.entity";

@Entity({name:'categories'})
export class Category {
    @PrimaryGeneratedColumn()
    id:number

    @Column({nullable:false,unique:true})
    title:string

    @OneToMany(() => Product , (product) => product.category)
    products:Product[]


}
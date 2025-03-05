import { Column , PrimaryGeneratedColumn , Entity} from "typeorm";


@Entity({name:'categories'})
export class Category {
    @PrimaryGeneratedColumn()
    id:number

    @Column({nullable:false,unique:true})
    title:string


}
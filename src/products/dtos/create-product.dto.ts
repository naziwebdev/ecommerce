import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  Min,
} from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty({ message: 'title is required' })
  title: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsString()
  @IsNotEmpty({ message: 'href is required' })
  href: string;

  @IsNumber()
  @Min(50, { message: 'min price is 50 toman' })
  @IsNotEmpty({ message: 'price is required' })
  price: number;

  @IsNumber()
  @Min(0, { message: 'min stock is 0' })
  @IsNotEmpty({ message: 'stock is required' })
  stock: number;

  @IsNumber()
  @IsNotEmpty({ message: 'category_id is required' })
  category_id: number;
}

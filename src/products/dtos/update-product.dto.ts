import { IsString, IsNumber, IsOptional, Min } from 'class-validator';

export class UpdateProductDto {
  @IsString()
  @IsOptional()
  title: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsString()
  @IsOptional()
  href: string;

  @IsNumber()
  @Min(50, { message: 'min price is 50 toman' })
  @IsOptional()
  price: number;

  @IsNumber()
  @Min(0, { message: 'min stock is 0' })
  @IsOptional()
  stock: number;

  @IsNumber()
  @IsOptional()
  category_id: number;
}

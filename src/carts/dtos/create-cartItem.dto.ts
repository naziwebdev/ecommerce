import { IsNotEmpty, IsNumber, Min, IsInt } from 'class-validator';

export class CreateCartItemDto {
  @IsInt()
  @Min(1, { message: 'min quantity is 1' })
  @IsNotEmpty({ message: 'stock is required' })
  quantity: number;

  @IsNumber()
  @IsNotEmpty({ message: 'product_id is required' })
  product_id: number;
}

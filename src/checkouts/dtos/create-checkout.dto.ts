import { IsInt, IsNotEmpty } from 'class-validator';

export class CreateCheckoutDto {
  @IsInt({ message: 'addressId must be int' })
  @IsNotEmpty({ message: 'this field is required' })
  addressId: number;
}

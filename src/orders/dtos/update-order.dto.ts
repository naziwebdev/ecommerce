import { IsNotEmpty, IsEnum } from 'class-validator';
import { StatusOrderEnum } from '../enums/status-enum';

export class UpdateOrderDto {
  @IsEnum(StatusOrderEnum)
  @IsNotEmpty({ message: 'status is required' })
  status: StatusOrderEnum;
}

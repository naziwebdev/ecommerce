import {
  IsString,
  IsNumber,
  IsNotEmpty,
  IsOptional,
  MinLength,
  Length,
} from 'class-validator';
import { LocationDto } from './location.dto';

export class CreateAddressDto {
  @IsString({ message: 'province must be string' })
  @IsNotEmpty({ message: 'province is required' })
  @MinLength(3, { message: 'min length must be 3 chars' })
  province: string;

  @IsString({ message: 'city must be string' })
  @IsNotEmpty({ message: 'city is required' })
  @MinLength(3, { message: 'min length must be 3 chars' })
  city: string;

  @IsString({ message: 'province must be string' })
  @IsNotEmpty({ message: 'province is required' })
  @MinLength(3, { message: 'min length must be 3 chars' })
  address: string;

  @IsOptional()
  @IsString()
  recieverPhone: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsNotEmpty()
  location: LocationDto;

  @IsString({ message: 'postslCode must be string' })
  @IsNotEmpty({ message: 'postalCode is required' })
  @Length(10, 10, { message: 'postalCode must be 10 length' })
  postalCode: string;

  @IsNumber()
  @IsNotEmpty({ message: 'block is required' })
  block: number;

  @IsNumber()
  @IsNotEmpty({ message: 'block is required' })
  floor: number;
}

import {
  IsString,
  MinLength,
  MaxLength,
  IsNotEmpty,
  Matches,
} from 'class-validator';
import { Transform } from "class-transformer";


export class CreateUserDto {
  @IsString({ message: 'username must be string' })
  @IsNotEmpty({ message: 'username is required' })
  @MinLength(3, { message: 'username must be at least 3 chars' })
  @MaxLength(255, { message: 'username must be max 255 chars' })
  username: string;

  @IsString({ message: 'phone must be string' })
  @IsNotEmpty({ message: 'phone is required' })
  @Matches(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/, {
    message: 'Phone number must be a valid format.',
  })
  @Transform(({value}) => value.trim())
  phone: string;

  @IsString({ message: 'password must be string' })
  @IsNotEmpty({ message: 'password is required' })
  @MinLength(8, { message: 'password must be at least 8 chars' })
  @MaxLength(255, { message: 'password can be max 255 chars' })
  @Matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/, {
    message:
      'password must be at least 8 char and contains number/char/capital-char',
  })
  password: string;
}

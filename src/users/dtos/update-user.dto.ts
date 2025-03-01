import {
    IsString,
    MinLength,
    MaxLength,
    IsOptional

  } from 'class-validator';
  
  
  export class UpdateUserDto {
    @IsString({ message: 'username must be string' })
    @IsOptional()
    @MinLength(3, { message: 'username must be at least 3 chars' })
    @MaxLength(255, { message: 'username must be max 255 chars' })
    username: string;
  }
  
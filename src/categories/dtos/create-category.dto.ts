import { IsString, IsNotEmpty, MinLength, MaxLength } from 'class-validator';

export class CreateCategoryDto {
  @IsString({ message: 'title must be string' })
  @IsNotEmpty({ message: 'title is required' })
  @MinLength(3, { message: 'min length must be 3 chars' })
  @MaxLength(255, { message: 'max length must be 255 chars' })
  title: string;
}

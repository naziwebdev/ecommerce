import { IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class CreateTicketDto {
  @IsString({ message: 'title must be sring' })
  @IsNotEmpty({ message: 'title is required' })
  title: string;

  @IsString({ message: 'desc must be sring' })
  @IsNotEmpty({ message: 'desc is required' })
  description: string;

  @IsNumber()
  @IsOptional()
  replyTo: number;
}

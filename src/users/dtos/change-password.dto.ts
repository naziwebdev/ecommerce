import {
  IsString,
  MinLength,
  MaxLength,
  IsNotEmpty,
  Matches,
  Validate,
} from 'class-validator';
import { PasswordsMatch } from '../custom-validators/match-password';

export class ChangePasswordDto {
  @IsString({ message: 'password must be string' })
  @IsNotEmpty({ message: 'password is required' })
  @MinLength(8, { message: 'password must be at least 8 chars' })
  @MaxLength(255, { message: 'password can be max 255 chars' })
  @Matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/, {
    message:
      'password must be at least 8 char and contains number/char/capital-char',
  })
  newPassword: string;

  @IsString({ message: 'password must be string' })
  @IsNotEmpty({ message: 'password is required' })
  @MinLength(8, { message: 'password must be at least 8 chars' })
  @MaxLength(255, { message: 'password can be max 255 chars' })
  @Matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/, {
    message:
      'password must be at least 8 char and contains number/char/capital-char',
  })
  @Validate(PasswordsMatch)
  confirmPassword: string;
}

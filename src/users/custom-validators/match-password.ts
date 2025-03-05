import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';

@ValidatorConstraint({ name: 'passwordsMatch', async: false })
export class PasswordsMatch implements ValidatorConstraintInterface {
  validate(confirmPassword: string, args: ValidationArguments) {
    const newPassword = (args.object as any).newPassword;
    return confirmPassword === newPassword;
  }

  defaultMessage(args: ValidationArguments) {
    return 'New password and confirm password do not match';
  }
}

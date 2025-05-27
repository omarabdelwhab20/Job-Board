import { IsEmail, IsNotEmpty } from 'class-validator';

export class ResetPasswordtDto {
  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Invalid email' })
  email: string;
}

import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class SignInDto {
  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Invalid email' })
  email: string;

  @IsNotEmpty({ message: 'Password is required' })
  password: string;
}

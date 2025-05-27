import {
  IsEmail,
  IsEnum,
  IsLocale,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Role } from '../entities/auth.entity';

export class SignUpDto {
  @IsNotEmpty({ message: 'User name is required' })
  @MaxLength(30, { message: 'User name must at most 30 characters' })
  @MinLength(5, { message: 'User name must be at least 5 characters' })
  userName: string;

  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Invalid email' })
  email: string;

  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(6, { message: 'Password must be at least 6 characters' })
  password: string;

  @IsNotEmpty({ message: 'Role is required' })
  @IsEnum(Role)
  role: Role;

  @IsOptional()
  @IsPhoneNumber()
  phone: string;

  @IsOptional()
  location: string;
}

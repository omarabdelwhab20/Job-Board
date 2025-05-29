import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsUrl,
  MaxLength,
  MinLength,
} from 'class-validator';

export class SignUpDto {
  @IsNotEmpty({ message: 'Company name is required' })
  @IsString({ message: 'Company name must be string' })
  @MaxLength(150, { message: 'Company name must be at most 30 characters' })
  @MinLength(2, { message: 'Company name must be at least 2 characters' })
  name: string;

  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Invalid email' })
  email: string;

  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(6, { message: 'Password must be at least 6 characters' })
  password: string;

  @IsNotEmpty({ message: 'Company description is required' })
  @IsString({ message: 'Company description must be string' })
  @MaxLength(150, {
    message: 'Company description must be at most 150 characters',
  })
  @MinLength(50, {
    message: 'Company description must be at least 50 characters',
  })
  description: string;

  @IsNotEmpty({ message: 'Website is required' })
  @IsUrl({}, { message: 'Invalid website url' })
  website: string;

  @IsNotEmpty({ message: 'Company location is required' })
  @IsString({ message: 'Company location must be string' })
  location: string;
}

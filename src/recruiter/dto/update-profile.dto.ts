import {
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from 'class-validator';

export class UpdateProfileDto {
  @IsOptional()
  @IsString({ message: 'Summary must be string' })
  summary: string;

  @IsOptional()
  @IsString()
  position: string;

  @IsOptional()
  @IsString()
  userName: string;

  @IsOptional()
  @IsPhoneNumber()
  phone: string;

  @IsOptional()
  @IsString()
  location: string;
}

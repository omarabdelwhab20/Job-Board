import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';

export class ExperienceDto {
  @IsString()
  @IsNotEmpty({ message: 'Job title is required' })
  title: string;

  @IsString()
  @IsNotEmpty({ message: 'Company name is required' })
  company: string;

  @IsString()
  @IsNotEmpty({ message: 'Duration period is required' })
  duration: string;
}

export class UpdateProfileDto {
  @IsNotEmpty({ message: 'Summary is required' })
  @MaxLength(150, { message: 'Summary must be at most 150 characters' })
  @MinLength(50, { message: 'Summary must be at least 50 characters' })
  summary: string;

  @IsOptional()
  @IsString()
  userName: string;

  @IsOptional()
  @IsPhoneNumber()
  phone: string;

  @IsOptional()
  @IsString()
  location: string;

  @IsOptional()
  @IsArray()
  skills: string[];

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => ExperienceDto)
  experience?: ExperienceDto[];
}

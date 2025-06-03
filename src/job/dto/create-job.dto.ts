import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ContractType, EmploymentType, Status } from '../entities/job.entity';
import { Transform } from 'class-transformer';

export class CreateJobDto {
  @IsNotEmpty({ message: 'Job title is required' })
  @IsString({ message: 'Job title must be string' })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  title: string;

  @IsNotEmpty({ message: 'Job description is required' })
  @IsString({ message: 'Job description must be string' })
  @MinLength(50, { message: 'Job description must be at least 100 characters' })
  description: string;

  @IsNotEmpty({ message: 'Employment type is required' })
  @IsEnum(EmploymentType, {
    message:
      'Employment type must be of these choices part time , full time or internship',
  })
  employmentType: EmploymentType;

  @IsOptional()
  @IsEnum(Status, {
    message: 'Job status must be of these choices active or in active',
  })
  jobStatus: Status;

  @IsNotEmpty({ message: 'Contract type is required' })
  @IsEnum(ContractType, {
    message: 'Contract type must be of these choices on site or remote',
  })
  contractType: ContractType;

  @IsNotEmpty({ message: 'Salary is required' })
  @IsNumber({}, { message: 'Salary must be a number ' })
  salary: number;

  @IsNotEmpty({ message: 'Location is required' })
  @IsString({ message: 'Location must be string ' })
  location: string;
}

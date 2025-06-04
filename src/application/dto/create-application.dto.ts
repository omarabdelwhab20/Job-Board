import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreateApplicationDto {
  @IsNotEmpty()
  @IsString()
  jobId: string;

  @IsNotEmpty()
  @IsString()
  resumeUrl: string;
}

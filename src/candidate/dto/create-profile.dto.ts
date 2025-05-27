import { IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class CreateCandidateDto {
  @IsNotEmpty({ message: 'Summary is required' })
  @MaxLength(150, { message: 'Summary must be at most 150 characters' })
  @MinLength(50, { message: 'Summary must be at least 50 characters' })
  summary: string;
}

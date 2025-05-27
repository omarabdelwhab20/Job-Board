import { PartialType } from '@nestjs/mapped-types';
import { CreateCandidateDto } from './create-profile.dto';

export class UpdateCandidateDto extends PartialType(CreateCandidateDto) {}

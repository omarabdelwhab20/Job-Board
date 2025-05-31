import { PartialType } from '@nestjs/mapped-types';
import { CreateRecruiterRequestDto } from './create-recruiter-request.dto';

export class UpdateRecruiterRequestDto extends PartialType(CreateRecruiterRequestDto) {}

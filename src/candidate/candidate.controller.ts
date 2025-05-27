import { Controller, Get, Post, Body, Patch, Param, Delete} from '@nestjs/common';
import { CandidateService } from './candidate.service';

@Controller('candidate/')
export class CandidateController {
  constructor(private readonly candidateService: CandidateService) {}

  
  @Get('get-me/:id')
  getMe(@Param("id") candidateId : string){
    return this.candidateService.getMe(candidateId)
  }


  @Patch('update-me/:id')
  updateMe(@Param("id") candidateId : string, @Body() updateProfileDto  : UpdateProfileDto){}
}


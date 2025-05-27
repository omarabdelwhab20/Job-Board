import { Injectable } from '@nestjs/common';

import { Repository } from 'typeorm';
import { Candidate } from './entities/candidate.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class CandidateService {
  constructor(
    @InjectRepository(Candidate)
    private readonly candidateRepository: Repository<Candidate>,
  ) {}

  async getMe(candidateId: string) {}
}

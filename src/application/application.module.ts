import { Module } from '@nestjs/common';
import { ApplicationService } from './application.service';
import { ApplicationController } from './application.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Application } from './entities/application.entity';
import { JobModule } from 'src/job/job.module';
import { CompanyModule } from 'src/company/company.module';
import { CandidateModule } from 'src/candidate/candidate.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Application]),
    JobModule,
    CompanyModule,
    CandidateModule,
  ],
  controllers: [ApplicationController],
  providers: [ApplicationService],
})
export class ApplicationModule {}

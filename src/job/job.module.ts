import { Module } from '@nestjs/common';
import { JobService } from './job.service';
import { JobController } from './job.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Job } from './entities/job.entity';
import { RecruiterModule } from 'src/recruiter/recruiter.module';

@Module({
  imports: [TypeOrmModule.forFeature([Job]), RecruiterModule],
  controllers: [JobController],
  providers: [JobService],
})
export class JobModule {}

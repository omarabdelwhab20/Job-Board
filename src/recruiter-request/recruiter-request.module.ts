import { Module } from '@nestjs/common';
import { RecruiterRequestService } from './recruiter-request.service';
import { RecruiterRequestController } from './recruiter-request.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecruiterRequest } from './entities/recruiter-request.entity';
import { RecruiterModule } from 'src/recruiter/recruiter.module';
import { CompanyModule } from 'src/company/company.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([RecruiterRequest]),
    RecruiterModule,
    CompanyModule,
  ],
  controllers: [RecruiterRequestController],
  providers: [RecruiterRequestService],
})
export class RecruiterRequestModule {}

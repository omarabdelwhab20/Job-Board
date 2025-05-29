import { Module } from '@nestjs/common';
import { RecruiterService } from './recruiter.service';
import { RecruiterController } from './recruiter.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Recruiter } from './entities/recruiter.entity';
import { CompanyModule } from 'src/company/company.module';
import { UploadModule } from 'src/upload/upload.module';

@Module({
  imports: [TypeOrmModule.forFeature([Recruiter]), CompanyModule, UploadModule],
  controllers: [RecruiterController],
  providers: [RecruiterService],
  exports: [TypeOrmModule],
})
export class RecruiterModule {}

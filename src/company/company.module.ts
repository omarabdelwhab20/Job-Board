import { Module } from '@nestjs/common';
import { CompanyService } from './company.service';
import { CompanyController } from './company.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Company } from './entities/company.entity';
import { UploadModule } from 'src/upload/upload.module';

@Module({
  imports: [TypeOrmModule.forFeature([Company]), UploadModule],
  controllers: [CompanyController],
  providers: [CompanyService],
  exports: [TypeOrmModule],
})
export class CompanyModule {}

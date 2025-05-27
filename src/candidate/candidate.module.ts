import { forwardRef, Module } from '@nestjs/common';
import { CandidateService } from './candidate.service';
import { CandidateController } from './candidate.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Candidate } from './entities/candidate.entity';
import { AuthModule } from 'src/auth/auth.module';
import { UploadFileService } from 'src/upload/upload.service';
import { UploadModule } from 'src/upload/upload.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Candidate]),
    forwardRef(() => AuthModule),
    UploadModule,
  ],
  controllers: [CandidateController],
  providers: [CandidateService],
  exports: [TypeOrmModule],
})
export class CandidateModule {}

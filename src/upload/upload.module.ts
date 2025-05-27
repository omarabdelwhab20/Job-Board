import { Module } from '@nestjs/common';
import { UploadFileService } from './upload.service';
import { UploadFileController } from './upload.controller';
import { CloudinaryProvider } from './cloudinary.provider';

@Module({
  controllers: [UploadFileController],
  providers: [UploadFileService, CloudinaryProvider],
  exports: [UploadFileService],
})
export class UploadModule {}

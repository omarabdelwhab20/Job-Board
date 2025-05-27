import {
  Controller,
  Delete,
  FileTypeValidator,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { UploadFileService } from './upload.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('file')
export class UploadFileController {
  constructor(private readonly uploadFileService: UploadFileService) {}

  @Post('profile-image/:userId')
  @UseInterceptors(FileInterceptor('file'))
  async uploadProfileImage(
    @Param('userId') userId: string,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 }), // 1MB
          new FileTypeValidator({
            fileType: /^(image\/jpeg|image\/png|image\/jpg)$/,
          }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    return this.uploadFileService.uploadProfileImage(file, userId);
  }

  @Post('resume/:userId')
  @UseInterceptors(FileInterceptor('file'))
  async uploadResume(
    @Param('userId') userId: string,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }), // 5MB
          new FileTypeValidator({ fileType: 'application/pdf' }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    return this.uploadFileService.uploadResume(file, userId);
  }

  @Delete('profile-image/:publicId')
  async deleteProfileImage(@Param('publicId') publicId: string) {
    await this.uploadFileService.deleteFile(publicId, 'image');
    return { message: 'Profile image deleted successfully' };
  }

  @Delete('resume/:publicId')
  async deleteResume(@Param('publicId') publicId: string) {
    await this.uploadFileService.deleteFile(publicId, 'raw');
    return { message: 'Resume deleted successfully' };
  }
}

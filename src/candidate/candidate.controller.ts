import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  Req,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { CandidateService } from './candidate.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { Roles } from 'src/auth/decorators/role.decorator';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('candidate/')
@Roles('candidate')
@UseGuards(AuthGuard)
export class CandidateController {
  constructor(private readonly candidateService: CandidateService) {}

  @Get('get-profile')
  getProfile(@Req() req: any) {
    return this.candidateService.getProfile(req.user);
  }

  @Patch('update-profile')
  updateProfile(@Req() req: any, @Body() updateProfileDto: UpdateProfileDto) {
    return this.candidateService.updateProfile(updateProfileDto, req.user);
  }

  @Post('upload-resume')
  @UseInterceptors(FileInterceptor('file'))
  uploadResume(@Req() req: any, @UploadedFile() file: Express.Multer.File) {
    return this.candidateService.uploadResume(file, req.user);
  }

  @Post('upload-image')
  @UseInterceptors(FileInterceptor('image'))
  uploadPicture(@Req() req: any, @UploadedFile() image: Express.Multer.File) {
    return this.candidateService.uploadPicture(image, req.user);
  }
}

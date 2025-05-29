import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { RecruiterService } from './recruiter.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { Roles } from 'src/auth/decorators/role.decorator';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('recruiter/')
@Roles('recruiter')
@UseGuards(AuthGuard)
export class RecruiterController {
  constructor(private readonly recruiterService: RecruiterService) {}

  @Get('get-profile')
  getProfile(@Req() req: any) {
    return this.recruiterService.getProfile(req.user);
  }

  @Patch('update-profile')
  updateMe(@Req() req: any, @Body() updateProfileDto: UpdateProfileDto) {
    return this.recruiterService.updateProfile(req.user, updateProfileDto);
  }

  @Post('upload-image')
  @UseInterceptors(FileInterceptor('image'))
  uploadPicture(@Req() req: any, @UploadedFile() image: Express.Multer.File) {
    return this.recruiterService.uploadPicture(image, req.user);
  }
}

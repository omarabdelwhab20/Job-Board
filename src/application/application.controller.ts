import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ApplicationService } from './application.service';
import { CreateApplicationDto } from './dto/create-application.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { Roles } from 'src/auth/decorators/role.decorator';

@Controller('application/')
@UseGuards(AuthGuard)
export class ApplicationController {
  constructor(private readonly applicationService: ApplicationService) {}

  @Post('candidate')
  @Roles('candidate')
  createApplication(
    @Body() createApplicationDto: CreateApplicationDto,
    @Req() req: any,
  ) {
    return this.applicationService.createApplication(
      createApplicationDto,
      req.user,
    );
  }

  @Get('candidate')
  @Roles('candidate')
  viewAllCandidateApplications(@Req() req: any) {
    return this.applicationService.viewAllCandidateApplications(req.user);
  }

  @Get('candidate/:applicationId')
  @Roles('candidate')
  viewOneCandidateApplications(
    @Param('applicationId') applicationId: string,
    @Req() req: any,
  ) {
    return this.applicationService.viewOneCandidateApplication(
      applicationId,
      req.user,
    );
  }

  @Get('recruiter/review/:applicationId')
  @Roles('recruiter')
  reviewApplication(
    @Param('applicationId') applicationId: string,
    @Req() req: any,
  ) {
    return this.applicationService.reviewApplication(applicationId, req.user);
  }

  @Patch('recruiter/accept/:applicationId')
  @Roles('recruiter')
  acceptApplication(
    @Param('applicationId') applicationId: string,
    @Req() req: any,
  ) {
    return this.applicationService.acceptApplication(applicationId, req.user);
  }

  @Patch('recruiter/decline/:applicationId')
  @Roles('recruiter')
  declineApplication(
    @Param('applicationId') applicationId: string,
    @Req() req: any,
  ) {
    return this.applicationService.declineApplication(applicationId, req.user);
  }
}

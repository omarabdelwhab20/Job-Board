import {
  Controller,
  Get,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Post,
} from '@nestjs/common';
import { RecruiterRequestService } from './recruiter-request.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { Roles } from 'src/auth/decorators/role.decorator';

@Controller('recruiter-request/')
@UseGuards(AuthGuard)
export class RecruiterRequestController {
  constructor(
    private readonly recruiterRequestService: RecruiterRequestService,
  ) {}

  @Post('create-request/:companyId')
  @Roles('recruiter')
  createRequest(@Param('companyId') companyId: string, @Req() req: any) {
    return this.recruiterRequestService.createRequest(companyId, req.user);
  }

  @Get('get-my-requests')
  @Roles('recruiter')
  viewRecruiterRequest(@Req() req: any) {
    return this.recruiterRequestService.viewRecruiterRequests(req.user);
  }

  @Delete('delete-request/:id')
  @Roles('recruiter')
  cancelRequest(@Param('id') requestId: string, @Req() req: any) {
    return this.recruiterRequestService.cancelRequest(requestId, req.user);
  }

  @Get('view-company-requests')
  @Roles('company')
  viewAllRequests(@Req() req: any) {
    return this.recruiterRequestService.viewAllCompanyRequests(req.user);
  }

  @Patch('accept-request/:requestId')
  @Roles('company')
  acceptRequest(@Param('requestId') requestId: string, @Req() req: any) {
    return this.recruiterRequestService.acceptRequest(requestId, req.user);
  }

  @Delete('decline-request/:requestId')
  @Roles('company')
  declineRequest(@Param('requestId') requestId: string, @Req() req: any) {
    return this.recruiterRequestService.declineRequest(requestId, req.user);
  }
}

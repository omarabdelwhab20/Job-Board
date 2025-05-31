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
import { RecruiterRequestService } from './recruiter-request.service';
import { CreateRecruiterRequestDto } from './dto/create-recruiter-request.dto';
import { UpdateRecruiterRequestDto } from './dto/update-recruiter-request.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { Roles } from 'src/auth/decorators/role.decorator';

@Controller('recruiter-request')
@UseGuards(AuthGuard)
export class RecruiterRequestController {
  constructor(
    private readonly recruiterRequestService: RecruiterRequestService,
  ) {}

  @Get('create-request/:companyId')
  @Roles('recruiter')
  createRequest(@Param('companyId') companyId: string, @Req() req: any) {
    return this.recruiterRequestService.createRequest(companyId, req.user);
  }

  @Get('get-recruiter-requests')
  viewRecruiterRequest() {
    return this.recruiterRequestService.findAll();
  }

  @Patch('accept-request')
  acceptRequest(
    @Param('id') id: string,
    @Body() updateRecruiterRequestDto: UpdateRecruiterRequestDto,
  ) {
    return this.recruiterRequestService.update(+id, updateRecruiterRequestDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.recruiterRequestService.remove(+id);
  }
}

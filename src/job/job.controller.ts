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
  Query,
} from '@nestjs/common';
import { JobService } from './job.service';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { Roles } from 'src/auth/decorators/role.decorator';
import { FilterJobDto } from './dto/filter-job.dto';

@Controller('job')
@UseGuards(AuthGuard)
export class JobController {
  constructor(private readonly jobService: JobService) {}

  @Post()
  @Roles('recruiter')
  createJob(@Body() createJobDto: CreateJobDto, @Req() req: any) {
    return this.jobService.createJob(createJobDto, req.user);
  }

  @Get()
  viewAllJobs(@Query() query: FilterJobDto) {
    return this.jobService.viewAllJobs(query);
  }

  @Get(':jobId')
  viewOneJob(@Param('jobId') jobId: string) {
    return this.jobService.viewOneJob(jobId);
  }

  @Patch(':jobId')
  updateJob(@Param('jobId') jobId: string, @Body() updateJobDto: UpdateJobDto) {
    return this.jobService.updateJob(jobId, updateJobDto);
  }

  @Delete(':jobId')
  removeJob(@Param('jobId') jobId: string) {
    return this.jobService.removeJob(jobId);
  }
}

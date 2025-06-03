import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { Repository } from 'typeorm';
import { Job } from './entities/job.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Recruiter } from 'src/recruiter/entities/recruiter.entity';
import { Company } from 'src/company/entities/company.entity';
import { FilterJobDto } from './dto/filter-job.dto';

@Injectable()
export class JobService {
  constructor(
    @InjectRepository(Job)
    private readonly jobRepository: Repository<Job>,

    @InjectRepository(Recruiter)
    private readonly recruiterRepository: Repository<Recruiter>,
  ) {}

  async createJob(createJobDto: CreateJobDto, currentUser: any) {
    if (currentUser.role !== 'recruiter') {
      throw new HttpException('Not authorized', HttpStatus.UNAUTHORIZED);
    }

    const recruiterFound = await this.recruiterRepository.findOne({
      where: { id: currentUser.id },
      relations: ['company'],
    });

    if (!recruiterFound) {
      throw new NotFoundException('Recruiter not found');
    }

    const newJob = this.jobRepository.create(createJobDto);
    newJob.recruiter = { id: currentUser.id } as Recruiter;
    newJob.company = { id: recruiterFound.company.id } as Company;
    await this.jobRepository.save(newJob);

    return {
      status: HttpStatus.CREATED,
      message: 'A new job has been created successfully',
      newJob,
    };
  }

  async viewAllJobs(query: FilterJobDto) {
    const { title, location, contractType, employmentType } = query;

    const queryString = this.jobRepository.createQueryBuilder('job');
    if (title) {
      queryString.andWhere('Lower(job.title) LIKE LOWER(:title)', {
        title: `%${title}%`,
      });
    }

    if (location) {
      queryString.andWhere('LOWER(job.location) LIKE LOWER(:location)', {
        location: `%${location}%`,
      });
    }

    if (contractType) {
      queryString.andWhere('(job.contractType) = :contractType', {
        contractType: contractType.toLowerCase(),
      });
    }

    if (employmentType) {
      queryString.andWhere('(job.employmentType) = :employmentType', {
        employmentType: employmentType.toLowerCase(),
      });
    }

    queryString.orderBy('job.createdAt', 'DESC');

    const data = await queryString.getMany();

    return {
      status: HttpStatus.OK,
      data,
    };
  }

  async viewOneJob(jobId: string) {
    const foundJob = await this.jobRepository
      .createQueryBuilder('job')
      .leftJoin('job.company', 'company')
      .leftJoin('job.recruiter', 'recruiter')
      .leftJoin('recruiter.user', 'user')
      .select([
        'job.title',
        'job.description',
        'job.employmentType',
        'job.jobStatus',
        'job.contractType',
        'job.location',
        'company.name',
        'company.logoUrl',
        'user.userName',
        'recruiter.id',
        'recruiter.position',
      ])
      .where('job.id =:jobId ', { jobId })
      .getOne();

    if (!foundJob) {
      throw new NotFoundException('Job not found ');
    }

    return {
      status: HttpStatus.OK,
      data: foundJob,
    };
  }

  async updateJob(jobId: string, updateJobDto: UpdateJobDto) {
    const existedJob = await this.jobRepository.findOne({
      where: { id: jobId },
    });

    if (!existedJob) {
      throw new NotFoundException('Job not found');
    }

    const mergedJob = this.jobRepository.merge(existedJob, updateJobDto);

    const updatedJob = await this.jobRepository.save(mergedJob);

    return {
      status: HttpStatus.OK,
      message: 'Job updated succesffully',
      data: updatedJob,
    };
  }

  async removeJob(jobId: string) {
    const existedJob = await this.jobRepository.findOne({
      where: { id: jobId },
    });

    if (!existedJob) {
      throw new NotFoundException('Job not found');
    }

    await this.jobRepository.delete({ id: jobId });

    return {
      status: HttpStatus.OK,
      message: 'Job deleted successfully',
    };
  }
}

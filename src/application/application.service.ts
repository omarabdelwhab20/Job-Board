import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateApplicationDto } from './dto/create-application.dto';

import { InjectRepository } from '@nestjs/typeorm';
import { Application, ApplicationStatus } from './entities/application.entity';
import { Repository } from 'typeorm';
import { Job, Status } from 'src/job/entities/job.entity';
import { Company } from 'src/company/entities/company.entity';
import { Candidate } from 'src/candidate/entities/candidate.entity';

@Injectable()
export class ApplicationService {
  constructor(
    @InjectRepository(Application)
    private readonly applicationRepository: Repository<Application>,

    @InjectRepository(Job)
    private readonly jobRepository: Repository<Job>,

    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,

    @InjectRepository(Candidate)
    private readonly candidateRepository: Repository<Candidate>,
  ) {}

  async createApplication(
    createApplicationDto: CreateApplicationDto,
    currentUser: any,
  ) {
    console.log(createApplicationDto);
    if (currentUser.role !== 'candidate') {
      throw new HttpException('Not authoeized', HttpStatus.UNAUTHORIZED);
    }

    const { jobId, resumeUrl } = createApplicationDto;
    console.log(jobId);

    const jobFound = await this.jobRepository.findOneBy({ id: jobId });

    if (!jobFound) {
      throw new NotFoundException('Job not found ');
    }

    const newApplication =
      this.applicationRepository.create(createApplicationDto);

    newApplication.candidate = currentUser;
    newApplication.job = jobFound;

    await this.applicationRepository.save(newApplication);

    return {
      status: HttpStatus.CREATED,
      message: 'Application created successfully',
    };
  }

  async viewAllCandidateApplications(currentUser: any) {
    if (currentUser.role !== 'candidate') {
      throw new HttpException('Not authorized', HttpStatus.UNAUTHORIZED);
    }

    const applications = await this.applicationRepository
      .createQueryBuilder('application')
      .leftJoin('application.job', 'job')
      .leftJoin('job.company', 'company')
      .leftJoin('application.candidate', 'candidate')
      .select([
        'application.status',
        'job.id',
        'job.title',
        'company.name',
        'company.logoUrl',
      ])
      .where('candidate.id = :candidateId', { candidateId: currentUser.id })
      .getMany();

    return {
      status: HttpStatus.OK,
      data: applications,
    };
  }

  async viewOneCandidateApplication(applicationId: string, currentUser: any) {
    if (currentUser.role !== 'candidate') {
      throw new HttpException('Not authorized', HttpStatus.UNAUTHORIZED);
    }

    const applicationFound = await this.applicationRepository
      .createQueryBuilder('application')
      .leftJoin('application.job', 'job')
      .leftJoin('job.company', 'company')
      .leftJoin('application.candidate', 'candidate')
      .select([
        'application.status',
        'application.resumeUrl',
        'job.title',
        'job.description',
        'job.employmentType',
        'job.contractType',
        'job.location',
        'job.salary',
        'company.name',
        'company.logoUrl',
      ])
      .where('candidate.id = :candidateId', { candidateId: currentUser.id })
      .andWhere('application.id = :applicationId', {
        applicationId: applicationId,
      })
      .getOne();

    if (!applicationFound) {
      throw new NotFoundException('Application not found');
    }

    return {
      status: HttpStatus.OK,
      data: applicationFound,
    };
  }

  async reviewApplication(applicationId: string, currentUser: any) {
    if (currentUser.role !== 'recruiter') {
      throw new HttpException('Un authorized', HttpStatus.UNAUTHORIZED);
    }

    const applicationFound = await this.applicationRepository.findOneBy({
      id: applicationId,
    });

    if (!applicationFound) {
      throw new NotFoundException('Application not found ');
    }

    return {
      staatus: HttpStatus.OK,
      data: applicationFound,
    };
  }

  async acceptApplication(applicationId: string, currentUser: any) {
    if (currentUser.role !== 'recruiter') {
      throw new HttpException('Not authorized', HttpStatus.UNAUTHORIZED);
    }

    const applicationFound = await this.applicationRepository.findOne({
      where: { id: applicationId },
      relations: ['job', 'job.company', 'candidate'],
    });

    if (!applicationFound) {
      throw new NotFoundException('Application not found ');
    }
    const candidate = applicationFound.candidate;

    applicationFound.status = ApplicationStatus.APPLIED;
    candidate.company = applicationFound.job.company;

    await this.applicationRepository.save(applicationFound);
    await this.candidateRepository.save(candidate);

    return {
      status: HttpStatus.OK,
      message: 'Application applied successfully',
    };
  }

  async declineApplication(applicationId: string, currentUser: any) {
    if (currentUser.role !== 'recruiter') {
      throw new HttpException('Not authorized', HttpStatus.UNAUTHORIZED);
    }

    const applicationFound = await this.applicationRepository.findOne({
      where: { id: applicationId },
    });

    applicationFound.status = ApplicationStatus.REJECTED;
    await this.applicationRepository.save(applicationFound);

    return {
      status: HttpStatus.OK,
      message: 'Application rejected successfully',
    };
  }
}

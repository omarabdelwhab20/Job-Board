import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateRecruiterRequestDto } from './dto/create-recruiter-request.dto';
import { UpdateRecruiterRequestDto } from './dto/update-recruiter-request.dto';
import { Repository } from 'typeorm';
import { Company } from 'src/company/entities/company.entity';
import { Recruiter } from 'src/recruiter/entities/recruiter.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { RecruiterRequest, Status } from './entities/recruiter-request.entity';

@Injectable()
export class RecruiterRequestService {
  constructor(
    @InjectRepository(RecruiterRequest)
    private readonly recruiterRequestRepository: Repository<RecruiterRequest>,

    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,

    @InjectRepository(Recruiter)
    private readonly recruiterRepository: Repository<Recruiter>,
  ) {}

  async createRequest(companyId: string, currentUser: any) {
    if (currentUser.role !== 'recruiter') {
      throw new HttpException('Not authorized', HttpStatus.UNAUTHORIZED);
    }

    const companyFound = await this.companyRepository.findOneBy({
      id: companyId,
    });

    if (!companyFound) {
      throw new NotFoundException('Company not found');
    }

    const recruiterFound = await this.recruiterRepository.findOneBy({
      id: currentUser.id,
    });
    if (!recruiterFound) {
      throw new NotFoundException('Recruiter not found');
    }

    const requestFound = await this.recruiterRequestRepository.findOneBy({
      recruiter: { id: recruiterFound.id },
      company: { id: companyFound.id },
    });

    if (requestFound) {
      throw new HttpException(
        'You have already requested to join this company',
        HttpStatus.BAD_REQUEST,
      );
    }

    const newRequest = this.recruiterRequestRepository.create({
      company: { id: companyFound.id },
      recruiter: { id: recruiterFound.id },
    });

    await this.recruiterRequestRepository.save(newRequest);

    return {
      status: HttpStatus.CREATED,
      message: 'A request has been sent to the company',
    };
  }

  async viewRecruiterRequests(currentUser: any) {
    if (currentUser.role !== 'recruiter') {
      throw new HttpException('Not authorized', HttpStatus.UNAUTHORIZED);
    }

    const userFound = await this.recruiterRepository.findOneBy({
      id: currentUser.id,
    });

    if (!userFound) {
      throw new NotFoundException('User not found');
    }

    const requests = await this.recruiterRequestRepository
      .createQueryBuilder('request')
      .leftJoin('request.company', 'company')
      .select([
        'company.name',
        'company.logoUrl',
        'request.status',
        'request.createdAt',
      ])
      .where('request.recruiter =:id', { id: currentUser.id })
      .getMany();

    if (!requests) {
      throw new NotFoundException('Requests not found');
    }

    return {
      status: HttpStatus.OK,
      data: requests,
    };
  }

  async cancelRequest(requestId: string, currentUser: any) {
    if (currentUser.role !== 'recruiter') {
      throw new HttpException('Not authorized', HttpStatus.UNAUTHORIZED);
    }

    const userFound = await this.recruiterRepository.findOneBy({
      id: currentUser.id,
    });

    if (!userFound) {
      throw new NotFoundException('User not found');
    }

    const requestFound = await this.recruiterRequestRepository.findOneBy({
      id: requestId,
    });

    if (!requestFound) {
      throw new NotFoundException('Request not found');
    }

    await this.recruiterRequestRepository.delete({
      id: requestId,
    });

    return {
      status: HttpStatus.OK,
      message: 'Request deleted successfully',
    };
  }

  async viewAllCompanyRequests(currentCompany: any) {
    if (currentCompany.role !== 'company') {
      throw new HttpException('Not authorized', HttpStatus.UNAUTHORIZED);
    }

    const companyFound = await this.companyRepository.findOneBy({
      id: currentCompany.id,
    });

    if (!companyFound) {
      throw new NotFoundException('Company not found');
    }

    const companyRequests = await this.recruiterRequestRepository
      .createQueryBuilder('request')
      .leftJoin('request.recruiter', 'recruiter')
      .leftJoin('recruiter.user', 'user')
      .select([
        'user.userName',
        'user.email',
        'recruiter.id',
        'recruiter.position',
        'request.createdAt',
      ])
      .where('request.company =:companyId', { companyId: currentCompany.id })
      .andWhere('request.status = :status', { status: Status.PENDING })
      .getMany();

    if (!companyRequests || companyRequests.length === 0) {
      throw new NotFoundException('Requests not found');
    }

    return {
      status: HttpStatus.FOUND,
      data: companyRequests,
    };
  }

  async acceptRequest(requestId: string, currentUser: any) {
    if (currentUser.role !== 'company') {
      throw new HttpException('Not authorized', HttpStatus.UNAUTHORIZED);
    }

    const requestFound = await this.recruiterRequestRepository.findOne({
      where: { id: requestId },
      relations: ['recruiter', 'company'],
    });

    console.log(requestFound);

    if (!requestFound) {
      throw new NotFoundException('Request not found');
    }

    const companyFound = await this.companyRepository.findOne({
      where: { id: currentUser.id },
      relations: ['recruiters'],
    });

    if (!companyFound) {
      throw new NotFoundException('Company not found');
    }

    requestFound.status = Status.ACCEPTED;

    requestFound.recruiter.company = companyFound;

    companyFound.recruiters = companyFound.recruiters || [];

    if (
      !companyFound.recruiters.find((r) => r.id === requestFound.recruiter.id)
    ) {
      companyFound.recruiters.push(requestFound.recruiter);
    }

    await this.companyRepository.save(companyFound);
    await this.recruiterRepository.save(requestFound.recruiter);
    await this.recruiterRequestRepository.save(requestFound);

    return {
      status: HttpStatus.OK,
      message: 'Request accepted successfully',
    };
  }

  async declineRequest(requestId: string, currentCompany: any) {
    if (currentCompany.role !== 'company') {
      throw new HttpException('Not authorized', HttpStatus.UNAUTHORIZED);
    }

    const requestFound = await this.recruiterRequestRepository.findOneBy({
      id: requestId,
    });

    if (!requestFound) {
      throw new NotFoundException('Request not found');
    }

    requestFound.status = Status.REJECTED;

    await this.recruiterRequestRepository.save(requestFound);

    return {
      status: HttpStatus.OK,
      message: 'Request declined successfully',
    };
  }
}

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
import { RecruiterRequest } from './entities/recruiter-request.entity';

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

    const newRequest = await this.recruiterRequestRepository.create({
      company: { id: companyFound.id },
      recruiter: { id: recruiterFound.id },
    });

    await this.recruiterRequestRepository.save(newRequest);

    return {
      status: HttpStatus.CREATED,
      message: 'A request has been sent to the company',
    };
  }

  findAll() {
    return `This action returns all recruiterRequest`;
  }

  findOne(id: number) {
    return `This action returns a #${id} recruiterRequest`;
  }

  update(id: number, updateRecruiterRequestDto: UpdateRecruiterRequestDto) {
    return `This action updates a #${id} recruiterRequest`;
  }

  remove(id: number) {
    return `This action removes a #${id} recruiterRequest`;
  }
}

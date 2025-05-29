import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Recruiter } from './entities/recruiter.entity';
import { Company } from 'src/company/entities/company.entity';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UploadFileService } from 'src/upload/upload.service';

@Injectable()
export class RecruiterService {
  constructor(
    @InjectRepository(Recruiter)
    private readonly recruiterRepository: Repository<Recruiter>,

    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,

    private readonly uploadFileService: UploadFileService,
  ) {}

  async getProfile(currentUser: any) {
    const profileData = await this.recruiterRepository
      .createQueryBuilder('recruiter')
      .leftJoinAndSelect('recruiter.user', 'user')
      .leftJoinAndSelect('recruiter.company', 'company')
      .select([
        'recruiter.id',
        'recruiter.summary',
        'recruiter.position',
        'user.email',
        'user.userName',
        'user.location',
        'user.phone',
        'user.role',
        'user.profilePictureUrl',
        'company.name',
        'company.logoUrl',
      ])
      .where('recruiter.id = :id', { id: currentUser.id })
      .getOne();

    if (!profileData) {
      throw new NotFoundException('Recruiter not found');
    }

    if (profileData.user.role !== 'recruiter') {
      throw new HttpException('Not authorized', HttpStatus.UNAUTHORIZED);
    }

    return {
      status: HttpStatus.OK,
      data: profileData,
    };
  }

  async updateProfile(currentUser: any, updateProfileDto: UpdateProfileDto) {
    const recruiter = await this.recruiterRepository
      .createQueryBuilder('recruiter')
      .leftJoinAndSelect('recruiter.company', 'company')
      .leftJoinAndSelect('recruiter.user', 'user')
      .where('recruiter.id =:id', { id: currentUser.id })
      .getOne();

    if (!recruiter) {
      throw new NotFoundException('Recruiter data not found');
    }

    if (recruiter.user.role !== 'recruiter') {
      throw new HttpException('Not authorized', HttpStatus.UNAUTHORIZED);
    }

    if (updateProfileDto.userName) {
      recruiter.user.userName = updateProfileDto.userName;
    }
    if (updateProfileDto.phone) {
      recruiter.user.phone = updateProfileDto.phone;
    }
    if (updateProfileDto.location) {
      recruiter.user.location = updateProfileDto.location;
    }

    const profileData = await this.recruiterRepository.merge(recruiter, {
      ...updateProfileDto,
    });

    await this.recruiterRepository.save(profileData);

    return {
      status: HttpStatus.OK,
      data: profileData,
    };
  }

  async uploadPicture(image: Express.Multer.File, currentUser: any) {
    const isFound = await this.recruiterRepository.findOne({
      where: { id: currentUser.id },
      relations: ['user'],
    });

    if (!isFound) {
      throw new NotFoundException('Error finding that page');
    }

    if (isFound.user.profilePicturePublicId && isFound.user.profilePictureUrl) {
      await this.uploadFileService.deleteFile(
        isFound.user.profilePictureUrl,
        'image',
      );
    }

    const { url, publicId } = await this.uploadFileService.uploadProfileImage(
      image,
      currentUser.id,
    );

    isFound.user.profilePictureUrl = url;
    isFound.user.profilePicturePublicId = publicId;
    await this.recruiterRepository.manager.save(isFound.user);

    return {
      message: 'Profile picture uploaded successfully',
      profilePictureUrl: url,
    };
  }
}

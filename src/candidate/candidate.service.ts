import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { Repository } from 'typeorm';
import { Candidate } from './entities/candidate.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/entities/auth.entity';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UploadFileService } from 'src/upload/upload.service';

@Injectable()
export class CandidateService {
  constructor(
    @InjectRepository(Candidate)
    private readonly candidateRepository: Repository<Candidate>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private readonly uploadFileService: UploadFileService,
  ) {}

  async getProfile(currentUser: any) {
    const profileData = await this.candidateRepository
      .createQueryBuilder('candidate')
      // Joining the related User entity using the 'user' relation defined in the Candidate entity.
      .leftJoinAndSelect('candidate.user', 'user')
      .leftJoinAndSelect('candidate.company', 'company')
      // Select only the columns we need from both Candidate and User.
      .select([
        'candidate.id',
        'candidate.experience',
        'candidate.skills',
        'candidate.summary',
        'candidate.resumeOriginalName',
        'candidate.resumeUrl',
        'user.email',
        'user.role',
        'user.userName',
        'user.location',
        'user.phone',
        'user.profilePictureUrl',
        'company.name',
        'company.logoUrl',
      ])
      .where('candidate.id = :id', { id: currentUser.id })
      .getOne();

    if (!profileData) {
      throw new NotFoundException('User not found');
    }

    if (profileData.user.role !== 'candidate') {
      throw new HttpException('Not authorized', HttpStatus.UNAUTHORIZED);
    }

    return {
      status: HttpStatus.OK,
      data: profileData,
    };
  }

  async updateProfile(updateProfileDto: UpdateProfileDto, currentUser: any) {
    const candidate = await this.candidateRepository
      .createQueryBuilder('candidate')
      .leftJoinAndSelect('candidate.user', 'user')
      .where('candidate.id = :id', { id: currentUser.id })
      .getOne();

    if (!candidate) {
      throw new NotFoundException('Error finding this page');
    }

    if (candidate.user.role !== 'candidate') {
      throw new HttpException('Not authorized', HttpStatus.UNAUTHORIZED);
    }

    if (updateProfileDto.userName) {
      candidate.user.userName = updateProfileDto.userName;
    }
    if (updateProfileDto.phone) {
      candidate.user.phone = updateProfileDto.phone;
    }
    if (updateProfileDto.location) {
      candidate.user.location = updateProfileDto.location;
    }
    const newProfileData = await this.candidateRepository.merge(candidate, {
      ...updateProfileDto,
    });
    await this.candidateRepository.save(newProfileData);

    return {
      status: HttpStatus.OK,
      data: newProfileData,
    };
  }

  async uploadResume(file: Express.Multer.File, currentUser: any) {
    const isFound = await this.candidateRepository.findOneBy({
      id: currentUser.id,
    });

    if (!isFound) {
      throw new NotFoundException('Error finding that page');
    }

    if (isFound.resumePublicId) {
      await this.uploadFileService.deleteFile(isFound.resumePublicId, 'raw');
    }

    const { url, publicId } = await this.uploadFileService.uploadResume(
      file,
      currentUser.id,
    );

    isFound.resumeUrl = url;
    isFound.resumePublicId = publicId;
    isFound.resumeOriginalName = file.originalname;

    await this.candidateRepository.save(isFound);

    return {
      message: 'Resume uploaded successfully',
      resumeUrl: url,
    };
  }

  async uploadPicture(image: Express.Multer.File, currentUser: any) {
    const isFound = await this.candidateRepository.findOne({
      where: { id: currentUser.id },
      relations: ['user'],
    });

    console.log('Candidate Data', isFound);

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

    // Update the related user entity
    isFound.user.profilePictureUrl = url;
    isFound.user.profilePicturePublicId = publicId;
    await this.candidateRepository.manager.save(isFound.user);

    return {
      message: 'Profile picture uploaded successfully',
      profilePictureUrl: url,
    };
  }
}

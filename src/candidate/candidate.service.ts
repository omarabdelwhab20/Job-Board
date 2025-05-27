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
    const isFound = await this.candidateRepository.findOneBy({
      id: currentUser.id,
    });

    if (!isFound) {
      throw new NotFoundException('Error finding that page');
    }

    if (currentUser.role !== 'candidate') {
      throw new HttpException('Not authorized', HttpStatus.UNAUTHORIZED);
    }

    const profileData = await this.candidateRepository
      .createQueryBuilder('candidate')
      // Joining the related User entity using the 'user' relation defined in the Candidate entity.
      .leftJoinAndSelect('candidate.user', 'user')
      // Select only the columns we need from both Candidate and User.
      .select([
        'candidate.id',
        'candidate.experience',
        'candidate.skills',
        'candidate.summary',
        'candidate.resumeOriginalName',
        'candidate.resumeUrl',
        'user.email',
        'user.userName',
        'user.location',
        'user.phone',
        'user.profilePictureUrl',
      ])
      .where('candidate.id = :id', { id: currentUser.id })
      .getOne();

    console.log(profileData);

    return {
      status: HttpStatus.OK,
      data: profileData,
    };
  }

  async updateProfile(updateProfileDto: UpdateProfileDto, currentUser: any) {
    const isFound = await this.candidateRepository.findOneBy({
      id: currentUser.id,
    });

    if (!isFound) {
      throw new NotFoundException('Error finding this page');
    }

    const profileData = await this.candidateRepository.merge(isFound, {
      ...updateProfileDto,
    });
    await this.candidateRepository.save(profileData);

    return {
      status: HttpStatus.OK,
      data: profileData,
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
    const isFound = await this.candidateRepository.findOneBy({
      id: currentUser.id,
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

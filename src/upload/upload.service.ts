import { Inject, Injectable, Logger } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryResponse } from './cloudinary-response';
import { CLOUDINARY } from './constant';
import * as streamifier from 'streamifier';

@Injectable()
export class UploadFileService {
  private readonly logger = new Logger(UploadFileService.name);

  constructor(@Inject(CLOUDINARY) private readonly cloudinaryConfig: any) {}

  async uploadFile(
    file: Express.Multer.File,
    options: any,
  ): Promise<CloudinaryResponse> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        options,
        (error, result) => {
          if (error) {
            this.logger.error('Upload error:', error);
            return reject(error);
          }
          resolve(result);
        },
      );

      streamifier.createReadStream(file.buffer).pipe(uploadStream);
    });
  }

  async uploadProfileImage(
    image: Express.Multer.File,
    userId: string,
  ): Promise<{ url: string; publicId: string }> {
    const result = await this.uploadFile(image, {
      folder: `users/${userId}/profile`,
      transformation: { width: 500, height: 800, crop: 'fill' },
    });

    return {
      url: result.secure_url,
      publicId: result.public_id,
    };
  }

  async uploadCompanyLogo(
    image: Express.Multer.File,
  ): Promise<{ url: string; publicId: string }> {
    const result = await this.uploadFile(image, {
      folder: `companies`,
      transformation: { width: 500, height: 800, crop: 'fill' },
    });

    return {
      url: result.secure_url,
      publicId: result.public_id,
    };
  }

  async uploadResume(
    file: Express.Multer.File,
    userId: string,
  ): Promise<{ url: string; publicId: string }> {
    const result = await this.uploadFile(file, {
      folder: `users/${userId}/resumes`,
      resource_type: 'raw',
    });
    return { url: result.secure_url, publicId: result.public_id };
  }

  async deleteFile(publicId: string, type: 'image' | 'raw' = 'image') {
    try {
      await cloudinary.uploader.destroy(publicId, { resource_type: type });
    } catch (error) {
      this.logger.error('File deletion error:', error);
      throw error;
    }
  }
}

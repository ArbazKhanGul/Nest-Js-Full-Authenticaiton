import { Injectable } from '@nestjs/common';
import { AppConfigService } from 'src/app-config/app-config.service';
import {
  v2 as cloudinary,
  UploadApiResponse,
  UploadApiErrorResponse,
} from 'cloudinary';

@Injectable()
export class CloudinaryService {
  constructor(private configService: AppConfigService) {
    cloudinary.config({
      cloud_name: this.configService.cloudinary.CLOUDINARY_CLOUD_NAME,
      api_key: this.configService.cloudinary.CLOUDINARY_API_KEY,
      api_secret: this.configService.cloudinary.CLOUDINARY_API_SECRET,
    });
  }

  async uploadImage(
    file: Express.Multer.File,
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        (error, result) => {
          if (error) return reject(error);
          if (result) return resolve(result);
          return reject(new Error('Upload failed: No result received.'));
        },
      );
      if (file && file.buffer) {
        uploadStream.end(file.buffer);
      } else {
        reject(new Error('Upload failed: No file buffer.'));
      }
    });
  }
}

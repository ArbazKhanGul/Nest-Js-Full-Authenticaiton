import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { CloudinaryService } from './cloudinary.service';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

@Module({
  imports: [
    ConfigModule,
    MulterModule.register({
      storage: new CloudinaryStorage({
        cloudinary: cloudinary,
        params: {
          folder: 'trvl', // Hardcoded folder name
          public_id: (req, file) => file.originalname.split('.')[0],
        },
      }),
    }),
  ],
  providers: [CloudinaryService],
  exports: [CloudinaryService],
})
export class CloudinaryModule {}

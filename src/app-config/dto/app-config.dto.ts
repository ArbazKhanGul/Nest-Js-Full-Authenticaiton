import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { NodeEnv } from '../types/app-config.interface';

export class AppConfigDTO {
  @IsNotEmpty()
  @IsString()
  @IsEnum(NodeEnv)
  NODE_ENV: NodeEnv;

  @IsNotEmpty()
  @IsNumber()
  PORT: number;

  // Database
  @IsNotEmpty()
  @IsString()
  MONGO_URL: string;

  // AUTH
  @IsNotEmpty()
  @IsString()
  ACCESS_TOKEN_SECRET: string;

  @IsNotEmpty()
  @IsString()
  ACCESS_TOKEN_EXPIRATION: string;

  // SEND GRID
  @IsNotEmpty()
  @IsString()
  API_KEY: string;

  @IsNotEmpty()
  @IsString()
  SEND_MAIL: string;

  @IsNotEmpty()
  @IsString()
  CLOUDINARY_CLOUD_NAME: string;

  // SEND GRID
  @IsNotEmpty()
  @IsString()
  CLOUDINARY_API_KEY: string;

  @IsNotEmpty()
  @IsString()
  CLOUDINARY_API_SECRET: string;
}

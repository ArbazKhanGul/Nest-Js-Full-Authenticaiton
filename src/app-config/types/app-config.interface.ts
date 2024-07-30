import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export enum NodeEnv {
  development = 'development',
  production = 'production',
}

export interface IAppConfig {
  core: {
    nodeEnv: NodeEnv;
    port: number;
  };
  database: {
    MONGODB: TypeOrmModuleOptions;
  };
  auth: {
    ACCESS_TOKEN_SECRET: string;
    ACCESS_TOKEN_EXPIRATION: string;
  };
  sendgrid: {
    API_KEY: string;
    SEND_MAIL: string;
  };
  cloudinary: {
    CLOUDINARY_CLOUD_NAME: string;
    CLOUDINARY_API_KEY: string;
    CLOUDINARY_API_SECRET: string;
  };
}

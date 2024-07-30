import { IAppConfig, NodeEnv } from '../types/app-config.interface';

export const mapAppConfig = (): IAppConfig => ({
  core: {
    nodeEnv: process.env.NODE_ENV as NodeEnv,
    port: parseInt(process.env.PORT!, 10) || 5000,
  },
  database: {
    MONGODB: {
      type: 'mongodb',
      url: process.env.MONGO_URL!,
      useUnifiedTopology: true,
      autoLoadEntities: true,
      synchronize: true,
    },
  },
  auth: {
    ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET!,
    ACCESS_TOKEN_EXPIRATION: process.env.ACCESS_TOKEN_EXPIRATION!,
  },
  sendgrid: {
    API_KEY: process.env.API_KEY!,
    SEND_MAIL: process.env.SEND_MAIL!,
  },
  cloudinary: {
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME!,
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY!,
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET!,
  },
});

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IAppConfig } from './types/app-config.interface';

/**
 * This is a custom configuration service that provides the configuration object available via the `ConfigService` with better TypeScript support.
 */
@Injectable()
export class AppConfigService {
  constructor(private readonly configService: ConfigService<IAppConfig>) {}

  get core(): IAppConfig['core'] {
    return this.configService.get('core', { infer: true })!;
  }

  get database(): IAppConfig['database'] {
    return this.configService.get('database', { infer: true })!;
  }

  get auth(): IAppConfig['auth'] {
    return this.configService.get('auth', { infer: true })!;
  }

  get sendgrid(): IAppConfig['sendgrid'] {
    return this.configService.get('sendgrid', { infer: true })!;
  }
  get cloudinary(): IAppConfig['cloudinary'] {
    return this.configService.get('cloudinary', { infer: true })!;
  }
}

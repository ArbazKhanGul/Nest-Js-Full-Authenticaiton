import { DynamicModule, Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { validateConfig, mapAppConfig } from './helpers';
import { AppConfigService } from './app-config.service';

@Module({})
@Global()
export class AppConfigModule {
  static register(): DynamicModule {
    return {
      module: AppConfigModule,
      imports: [
        ConfigModule.forRoot({
          envFilePath: '.env',
          validate: validateConfig,
          load: [mapAppConfig],
        }),
      ],
      providers: [AppConfigService],
      exports: [AppConfigService],
    };
  }
}

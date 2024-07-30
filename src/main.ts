import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppConfigService } from 'src/app-config/app-config.service';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  const appConfigService = app.get(AppConfigService);
  await app.listen(appConfigService.core.port);
}
bootstrap();

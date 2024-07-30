import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AppConfigModule } from './app-config/app-config.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppConfigService } from './app-config/app-config.service';
import { MailerModule } from './mailer/mailer.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';

@Module({
  imports: [
    UserModule,
    AppConfigModule.register(),
    TypeOrmModule.forRootAsync({
      useFactory: (appConfigService: AppConfigService) => {
        return appConfigService.database.MONGODB;
      },
      inject: [AppConfigService],
    }),
    MailerModule,
    CloudinaryModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

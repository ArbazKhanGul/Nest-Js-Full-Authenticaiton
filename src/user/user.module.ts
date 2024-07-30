import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { AccessTokenStrategy } from './strategies/acess-token.strategy';
import { MailerModule } from 'src/mailer/mailer.module';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.register({}),
    MailerModule,
    CloudinaryModule,
  ],
  controllers: [UserController],
  providers: [UserService, AccessTokenStrategy],
})
export class UserModule {}

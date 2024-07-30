import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AppConfigService } from 'src/app-config/app-config.service';
import { User, UserRole } from './entities/user.entity';
import { RegisterDTO } from './dto/register.dto';
import { LoginDTO } from './dto/login.dto';
import { LoginResponse } from './types/response';
import { TokenPayload } from './types/jwt.types';
import { instanceToPlain } from 'class-transformer';
import { ObjectId } from 'mongodb';
import { MailerService } from '../mailer/mailer.service';
import * as otpGenerator from 'otp-generator';

@Injectable()
export class UserService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly appConfigService: AppConfigService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly mailerService: MailerService,
  ) {}

  async register(input: RegisterDTO) {
    if (!!(await this.findOneByEmail(input.email))) {
      throw new ForbiddenException('Email already exist');
    }

    const otp = this.generateOtp();
    const otpExpiration = new Date();
    otpExpiration.setMinutes(otpExpiration.getMinutes() + 10); // OTP expires in 10 minutes

    // Create User
    const user = await this.create({
      email: input.email,
      password: input.password,
      name: input.name,
      role: UserRole.user,
      otp: {
        value: otp,
        expiration: otpExpiration,
      },
    });

    await this.sendOtpEmail(user, otp);

    return { message: 'User created succesfully' };
  }

  async login(input: LoginDTO): Promise<LoginResponse> {
    const user = await this.findOneByEmail(input.email);

    if (!user) {
      throw new BadRequestException('Invalid credentials');
    }

    // Check if passwords match
    if (!(await user.comparePassword(input.password))) {
      throw new BadRequestException('Invalid credentials');
    }

    if (!user.emailVerification) {
      throw new BadRequestException('Please verify your email first');
    }
    const tokenPayload = new TokenPayload({
      sub: user._id.toString(),
      role: user.role,
      email: user.email,
    });

    const token = await this.generateToken(tokenPayload);

    const userWithoutPassword = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      profileImage: user.profileImage,
      role: user.role,
      created_at: user.created_at,
      updated_at: user.updated_at,
    };

    return {
      user: userWithoutPassword,
      access_token: token,
    };
  }

  async verifyOtp(email: string, otp: string): Promise<boolean> {
    const user = await this.findOneByEmail(email);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.otp.value != otp) {
      throw new BadRequestException('Invalid OTP');
    }

    if (new Date() > new Date(user.otp.expiration)) {
      throw new BadRequestException('OTP has expired');
    }

    user.emailVerification = true;
    user.otp.value = '';
    user.otp.expiration = new Date(0);

    await this.userRepository.save(user);

    return true;
  }

  async resendOtp(email: string): Promise<void> {
    const user = await this.findOneByEmail(email);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.emailVerification) {
      throw new BadRequestException('Email is already verified');
    }

    const otp = this.generateOtp();
    const otpExpiration = new Date();
    otpExpiration.setMinutes(otpExpiration.getMinutes() + 10); // OTP expires in 10 minutes

    user.otp = {
      value: otp,
      expiration: otpExpiration,
    };

    await this.userRepository.save(user);
    await this.sendOtpEmail(user, otp);
  }

  //forgot password service function
  async sendForgotPasswordOtp(email: string): Promise<void> {
    const user = await this.findOneByEmail(email);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const otp = this.generateOtp();
    const otpExpiration = new Date();
    otpExpiration.setMinutes(otpExpiration.getMinutes() + 10); // OTP expires in 10 minutes

    user.otp = {
      value: otp,
      expiration: otpExpiration,
    };

    await this.userRepository.save(user);
    await this.sendForgotPasswordOtpEmail(user, otp);
  }

  async verifyForgotPasswordOtp(
    email: string,
    otp: string | number,
  ): Promise<string> {
    const user = await this.findOneByEmail(email);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.otp.value != otp) {
      throw new BadRequestException('Invalid OTP');
    }

    if (new Date() > new Date(user.otp.expiration)) {
      throw new BadRequestException('OTP has expired');
    }

    // Clear the OTP after successful verification
    user.otp.value = '';
    user.otp.expiration = new Date(0);

    await this.userRepository.save(user);

    const tokenPayload = new TokenPayload({
      sub: user._id.toString(),
      role: user.role,
      email: user.email,
    });

    const token = await this.generateToken(tokenPayload);

    return token;
  }

  async resetPassword(userId: string, newPassword: string): Promise<void> {
    const user = await this.findOneById(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }
    user.password = newPassword;
    await this.userRepository.save(user);
  }

  async updateProfileImage(userId: string, imageurl: string): Promise<void> {
    const user = await this.findOneById(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }
    user.profileImage = imageurl;
    await this.userRepository.save(user);
  }

  async updatePassword(
    userId: string,
    oldPassword: string,
    newPassword: string,
  ): Promise<void> {
    console.log('🚀 ~ UserService ~ oldPassword:', oldPassword);
    const user = await this.findOneById(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isMatch = await user.comparePassword(oldPassword);
    console.log('🚀 ~ UserService ~ isMatch:', isMatch);
    if (!isMatch) {
      throw new BadRequestException('Old password is incorrect');
    }

    user.password = newPassword;
    await this.userRepository.save(user);
  }

  //supporting functions
  private generateToken(payload: TokenPayload): Promise<string> {
    return this.jwtService.signAsync(instanceToPlain(payload), {
      secret: this.appConfigService.auth.ACCESS_TOKEN_SECRET,
      expiresIn: this.appConfigService.auth.ACCESS_TOKEN_EXPIRATION,
    });
  }

  create(user: Partial<User>): Promise<User> {
    const preparedUser = this.userRepository.create(user);
    return this.userRepository.save(preparedUser);
  }

  findOneByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOneBy({
      email: email.toLowerCase().trim(),
    });
  }

  findOneById(id: string): Promise<User | null> {
    const objectId = new ObjectId(id);
    return this.userRepository.findOneBy({ _id: objectId });
  }

  private generateOtp(): string {
    return otpGenerator.generate(4, {
      upperCaseAlphabets: false,
      specialChars: false,
      lowerCaseAlphabets: false,
      digits: true,
    });
  }

  private async sendOtpEmail(user: User, otp: string) {
    const subject = 'Your OTP Code';
    const html = `<strong>Hi ${user.name}, your OTP code is ${otp}. It will expire in 10 minutes.</strong>`;
    await this.mailerService.sendEmail(user.email, subject, html);
  }

  private async sendForgotPasswordOtpEmail(user: User, otp: string) {
    const subject = 'Your OTP Code for Password Reset';
    const html = `<strong>Hi ${user.name}, your OTP code for password reset is ${otp}. It will expire in 10 minutes.</strong>`;
    await this.mailerService.sendEmail(user.email, subject, html);
  }
}

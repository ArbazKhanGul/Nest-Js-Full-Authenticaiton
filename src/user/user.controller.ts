import {
  BadRequestException,
  Body,
  Controller,
  Get,
  NotFoundException,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

import { UserService } from './user.service';
import { RegisterDTO } from './dto/register.dto';
import { LoginDTO } from './dto/login.dto';
import { LoginResponse } from './types/response';
import { AccessTokenGuard } from './guards/access-token.guard';
import { CurrentUserPayload } from './decorator/user-payload.decorator';
import { VerifyOtpDTO } from './dto/verify-otp.dto';
import { ResendOtpDTO } from './dto/resend-otp.dto';
import { ForgotPasswordDTO } from './dto/forgot-password-otp.dto';
import { VerifyForgotPasswordOtpDTO } from './dto/verify-forgot-password-otp.dto';
import { ResetPasswordDTO } from './dto/reset-password.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { UpdatePasswordDTO } from './dto/update-password.dto';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @Post('/register')
  async register(@Body() createUserDto: RegisterDTO) {
    return this.userService.register(createUserDto);
  }

  @Post('/login')
  async login(@Body() loginUser: LoginDTO): Promise<LoginResponse> {
    return this.userService.login(loginUser);
  }

  @Get('/profile')
  @UseGuards(AccessTokenGuard)
  async getProfile(@CurrentUserPayload('sub') userId: string) {
    const user = await this.userService.findOneById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  @Post('/verify-otp')
  async verifyOtp(@Body() verifyOtpDto: VerifyOtpDTO) {
    const { email, otp } = verifyOtpDto;
    const isVerified = await this.userService.verifyOtp(email, otp);
    if (!isVerified) {
      throw new BadRequestException('OTP verification failed');
    }
    return { message: 'Email successfully verified' };
  }

  @Post('/resend-otp')
  async resendOtp(@Body() resendOtpDto: ResendOtpDTO) {
    await this.userService.resendOtp(resendOtpDto.email);
    return { message: 'OTP has been resent' };
  }

  @Post('/forgot-password')
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDTO) {
    await this.userService.sendForgotPasswordOtp(forgotPasswordDto.email);
    return { message: 'OTP for password reset has been sent' };
  }

  @Post('/verify-forgot-password-otp')
  async verifyForgotPasswordOtp(
    @Body() verifyForgotPasswordOtpDto: VerifyForgotPasswordOtpDTO,
  ) {
    const { email, otp } = verifyForgotPasswordOtpDto;
    const token = await this.userService.verifyForgotPasswordOtp(email, otp);
    return { message: 'OTP successfully verified', access_token: token };
  }

  @Post('/reset-password')
  @UseGuards(AccessTokenGuard)
  async resetPassword(
    @CurrentUserPayload('sub') userId: string,
    @Body() resetPasswordDto: ResetPasswordDTO,
  ) {
    await this.userService.resetPassword(userId, resetPasswordDto.newPassword);
    return { message: 'Password has been updated' };
  }

  @Post('/upload-profile-image')
  @UseGuards(AccessTokenGuard)
  @UseInterceptors(FileInterceptor('profileImage'))
  async uploadProfileImage(
    @CurrentUserPayload('sub') userId: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    const result = await this.cloudinaryService.uploadImage(file);

    if ('error' in result) {
      throw new BadRequestException('Failed to upload image');
    }

    await this.userService.updateProfileImage(userId, result.secure_url);

    return {
      message: 'Profile image updated successfully',
      imageUrl: result.secure_url,
    };
  }

  @Post('/update-password')
  @UseGuards(AccessTokenGuard)
  async updatePassword(
    @CurrentUserPayload('sub') userId: string,
    @Body() updatePasswordDto: UpdatePasswordDTO,
  ) {
    await this.userService.updatePassword(
      userId,
      updatePasswordDto.oldPassword,
      updatePasswordDto.newPassword,
    );
    return { message: 'Password updated successfully' };
  }
}

import { IsEmail, IsNotEmpty, Length } from 'class-validator';

export class VerifyForgotPasswordOtpDTO {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @Length(4, 4)
  otp: string;
}

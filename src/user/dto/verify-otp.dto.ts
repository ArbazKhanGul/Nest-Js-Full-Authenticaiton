import { IsEmail, IsNotEmpty, Length } from 'class-validator';

export class VerifyOtpDTO {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @Length(4, 4)
  otp: string;
}

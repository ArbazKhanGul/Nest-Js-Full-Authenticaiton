import { IsEmail, IsNotEmpty } from 'class-validator';

export class ResendOtpDTO {
  @IsEmail()
  @IsNotEmpty()
  email: string;
}

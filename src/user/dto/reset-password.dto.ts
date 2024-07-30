import { IsNotEmpty } from 'class-validator';

export class ResetPasswordDTO {
  @IsNotEmpty()
  newPassword: string;
}

import { Injectable } from '@nestjs/common';
import * as sgMail from '@sendgrid/mail';
import { AppConfigService } from 'src/app-config/app-config.service';
@Injectable()
export class MailerService {
  constructor(private configService: AppConfigService) {
    const sendgridApiKey = this.configService.sendgrid.API_KEY;
    sgMail.setApiKey(sendgridApiKey);
  }

  async sendEmail(to: string, subject: string, html: string) {
    const msg = {
      to,
      from: this.configService.sendgrid.SEND_MAIL, // Use the email address or domain you verified with SendGrid
      subject,
      html,
    };

    try {
      await sgMail.send(msg);
      return { success: true };
    } catch (error) {
      console.error('Error sending email:', error);
      if (error.response) {
        console.error(error.response.body);
      }
      return { success: false, error };
    }
  }
}

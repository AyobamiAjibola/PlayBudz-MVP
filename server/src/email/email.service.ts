import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';

@Injectable()
export class EmailService {
  private readonly resend: Resend;

  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.get<string>('RESEND_API_KEY');

    if (!apiKey) {
      throw new InternalServerErrorException('RESEND_API_KEY is missing');
    }

    this.resend = new Resend(apiKey);
  }

  sendEmail(params: { to: string | string[]; subject: string; html: string }) {
    return this.resend.emails.send({
      from: 'Your App <onboarding@resend.dev>',
      to: params.to,
      subject: params.subject,
      html: params.html,
    });
  }

  async sendOtp(email: string, otp: string) {
    return this.sendEmail({
      to: email,
      subject: 'Your verification code',
      html: `
            <h2>Your verification code</h2>
            <p>Your OTP is:</p>
            <h1>${otp}</h1>
            <p>This code expires in 5 minutes.</p>
        `,
    });
  }
}

import mailgun from 'mailgun-js';

import { EmailService } from './EmailService';
import { EmailSendDTO } from '../models/EmailSendDTO';

interface SenderInfo {
  name: string;
  address: string;
}

export class MailgunEmailService implements EmailService {
  private readonly senderInfo: SenderInfo;

  private readonly mailgunClient: mailgun.Mailgun;

  constructor(env = process.env) {
    this.senderInfo = {
      name: process.env.EMAIL_SENDER_ADDRESS,
      address: process.env.EMAIL_SENDER_ADDRESS,
    };

    const config = {
      apiKey: process.env.MAILGUN_API_KEY,
      host: process.env.MAILGUN_API_HOST,
      domain: process.env.MAILGUN_DOMAIN,
    };

    this.mailgunClient = new mailgun(config);
  }

  public async sendEmail(emailSendDTO: EmailSendDTO): Promise<void> {
    const {
      to,
      message: { subject, html, text },
    } = emailSendDTO;

    const from = `${this.senderInfo.name} <${this.senderInfo.address}>`;

    const emailData: mailgun.messages.SendData = {
      from,
      to,
      subject,
      text,
      html,
    };

    await this.mailgunClient.messages().send(emailData);
  }
}

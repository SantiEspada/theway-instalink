import { EmailService } from './EmailService';
import { EmailSendDTO } from '../models/EmailSendDTO';

export class FakeEmailService implements EmailService {
  public async sendEmail(emailSendDTO: EmailSendDTO): Promise<void> {
    console.log('Email sent:');
    console.log(JSON.stringify(emailSendDTO));
  }
}

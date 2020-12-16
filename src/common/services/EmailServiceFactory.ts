import { Factory } from '../modules/Factory';
import { EmailService } from './EmailService';
import { MailgunEmailService } from './MailgunEmailService';
import { FakeEmailService } from './FakeEmailService';

export class EmailServiceFactory implements Factory<EmailService> {
  private readonly isServiceEnabled: boolean;

  constructor(env = process.env) {
    this.isServiceEnabled = env.NODE_ENV === 'production';
  }

  public create(): EmailService {
    return this.isServiceEnabled
      ? new MailgunEmailService()
      : new FakeEmailService();
  }
}

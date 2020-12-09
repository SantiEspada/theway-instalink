import { EmailSendDTO } from '../models/EmailSendDTO';

export interface EmailService {
  sendEmail(emailSendDTO: EmailSendDTO): Promise<void>;
}

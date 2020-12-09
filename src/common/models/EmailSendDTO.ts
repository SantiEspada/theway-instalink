import { EmailMessage } from './EmailMessage';

export interface EmailSendDTO {
  to: string;
  message: EmailMessage;
}

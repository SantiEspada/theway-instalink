import { StatusCodes } from 'http-status-codes';
import { nanoid } from 'nanoid';
import dedent from 'dedent-tabs';

import { Interactor } from '../../common/modules/Interactor';
import { AuthSession } from '../models/AuthSession';
import { AuthSessionCreationDTO } from '../models/AuthSessionCreationDTO';
import { AuthSessionRepository } from '../repositories/AuthSessionRepository';
import { MongoDBAuthSessionRepository } from '../repositories/MongoDBAuthSessionRepository';
import { EmailMessage } from '../../common/models/EmailMessage';
import { EmailSendDTO } from '../../common/models/EmailSendDTO';
import { EmailService } from '../../common/services/EmailService';
import { EmailServiceFactory } from '../../common/services/EmailServiceFactory';
import { ApiError } from '../../common/models/ApiError';

export interface CreateAuthSessionInput {
  email: string;
}

export interface CreateAuthSessionOutput {
  email: string;
  nonce: string;
}

export class CreateAuthSessionInteractor
  implements Interactor<CreateAuthSessionInput, CreateAuthSessionOutput> {
  private readonly ALLOWED_EMAIL_DOMAINS: string[];
  private readonly BASE_URL: string;

  private readonly emailService: EmailService;

  constructor(
    env = process.env,
    private readonly authSessionRepository: AuthSessionRepository = new MongoDBAuthSessionRepository(),
    emailServiceFactory: EmailServiceFactory = new EmailServiceFactory()
  ) {
    this.ALLOWED_EMAIL_DOMAINS = env.ALLOWED_EMAIL_DOMAINS.split(',');
    this.BASE_URL = env.BASE_URL;

    this.emailService = emailServiceFactory.create();
  }

  public async interact(
    input: CreateAuthSessionInput
  ): Promise<CreateAuthSessionOutput> {
    const { email: originalEmail } = input;

    if (this.isValidEmail(originalEmail)) {
      const authSession = await this.createAuthSession(originalEmail);

      const loginLink = this.generateLoginLink(authSession);

      const emailMessage = this.generateLoginEmailMessage(loginLink);

      await this.sendEmailMessage(authSession.email, emailMessage);

      const output: CreateAuthSessionOutput = {
        email: authSession.email,
        nonce: authSession.nonce,
      };

      return output;
    }
  }

  private isValidEmail(email: string): true | never {
    const isValid = this.ALLOWED_EMAIL_DOMAINS.some((allowedEmailDomain) =>
      email.endsWith(allowedEmailDomain)
    );

    if (!isValid) {
      throw new ApiError('Invalid email', StatusCodes.BAD_REQUEST);
    }

    return isValid;
  }

  private async createAuthSession(email: string): Promise<AuthSession> {
    const nonce = nanoid();

    const creationDTO: AuthSessionCreationDTO = {
      email,
      nonce,
    };

    const authSession = await this.authSessionRepository.create(creationDTO);

    return authSession;
  }

  private generateLoginLink(authSession: AuthSession): string {
    const emailLink = `${this.BASE_URL}/auth/login?sessionId=${authSession.id}`;

    return emailLink;
  }

  private generateLoginEmailMessage(emailLink: string): EmailMessage {
    const text = dedent`
      Hola,

      Te mandamos este correo electrónico porque has intentado iniciar sesión en InstaLink.

      Accede al siguiente enlace en tu navegador para continuar con el inicio de sesión:

      ${emailLink}

      ¿No has sido tú? Ignora el enlace y avísanos con un correo a tech@theway.coach.`;

    const html = dedent`
      <p>Hola,</p>

      <p>Te mandamos este correo electrónico porque has intentado iniciar sesión en InstaLink.

      <p>Haz clic en el siguiente enlace o cópialo y pégalo en la barra de direcciones de tu navegador para continuar con el inicio de sesión:<p>

      <p>
        <strong><a href="${emailLink}">${emailLink}</a></strong>
      </p>
      
      <p>¿No has sido tú? Ignora el enlace y avísanos con un correo a <a href="mailto:tech@theway.coach">tech@theway.coach</a>.</p>`;

    const emailMessage: EmailMessage = {
      subject: 'Iniciar sesión en InstaLink',
      html,
      text,
    };

    return emailMessage;
  }

  private async sendEmailMessage(
    email: string,
    emailMessage: EmailMessage
  ): Promise<void> {
    const sendDTO: EmailSendDTO = {
      to: email,
      message: emailMessage,
    };

    try {
      await this.emailService.sendEmail(sendDTO);
    } catch (err) {
      throw new ApiError(
        `Login email cannot be sent: ${err.message}`,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }
}

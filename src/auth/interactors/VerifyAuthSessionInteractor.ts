import { StatusCodes } from 'http-status-codes';

import { Interactor } from '../../common/modules/Interactor';
import { ApiError } from '../../common/models/ApiError';
import { AuthSession } from '../models/AuthSession';
import { AuthTokenSigningDTO } from '../models/AuthTokenSigningDTO';
import { AuthSessionRepository } from '../repositories/AuthSessionRepository';
import { MongoDBAuthSessionRepository } from '../repositories/MongoDBAuthSessionRepository';
import { AuthTokenService } from '../services/AuthTokenService';
import { JsonWebTokenAuthTokenService } from '../services/JsonWebTokenAuthTokenService';

export interface VerifyAuthSessionInput {
  id: string;
  email: string;
  nonce: string;
}

export interface VerifyAuthSessionOutput {
  token: string;
}

export class VerifyAuthSessionInteractor
  implements Interactor<VerifyAuthSessionInput, VerifyAuthSessionOutput> {
  constructor(
    private readonly authSessionRepository: AuthSessionRepository = new MongoDBAuthSessionRepository(),
    private readonly authTokenService: AuthTokenService = new JsonWebTokenAuthTokenService()
  ) {}

  public async interact(
    input: VerifyAuthSessionInput
  ): Promise<VerifyAuthSessionOutput> {
    const authSession = await this.findAuthSession(input);

    const authTokenSigningDTO: AuthTokenSigningDTO = {
      sessionId: authSession.id,
      email: authSession.email,
    };

    const signedToken = this.authTokenService.signToken(authTokenSigningDTO);

    const output = {
      token: signedToken,
    };

    return output;
  }

  private async findAuthSession(
    input: VerifyAuthSessionInput
  ): Promise<AuthSession> {
    try {
      const authSession = await this.authSessionRepository.findOne(input);

      return authSession;
    } catch (err) {
      throw new ApiError('Invalid session', StatusCodes.FORBIDDEN);
    }
  }
}

import { Interactor } from '../../common/modules/Interactor';
import { AuthSession } from '../models/AuthSession';
import { AuthSessionRepository } from '../repositories/AuthSessionRepository';
import { MongoDBAuthSessionRepository } from '../repositories/MongoDBAuthSessionRepository';
import { AuthSessionDeletionDTO } from '../models/AuthSessionDeletionDTO';
import { JsonWebTokenAuthTokenService } from '../services/JsonWebTokenAuthTokenService';
import { AuthSessionFindDTO } from '../models/AuthSessionFindDTO';

export interface DeleteAuthSessionInput {
  token: string;
}

export type DeleteAuthSessionOutput = void;

export class DeleteAuthSessionInteractor
  implements Interactor<DeleteAuthSessionInput, DeleteAuthSessionOutput>
{
  constructor(
    private readonly authTokenService = new JsonWebTokenAuthTokenService(),
    private readonly authSessionRepository: AuthSessionRepository = new MongoDBAuthSessionRepository()
  ) {}

  public async interact(
    input: DeleteAuthSessionInput
  ): Promise<DeleteAuthSessionOutput> {
    const { token } = input;

    const authSession = await this.extractAuthSessionFromToken(token);

    await this.deleteAuthSession(authSession);
  }

  private async extractAuthSessionFromToken(
    token: string
  ): Promise<AuthSession> {
    const { sessionId: authSessionId } =
      await this.authTokenService.verifyToken({ token });

    const authSessionFindDTO: AuthSessionFindDTO = {
      id: authSessionId,
    };

    const authSession = await this.authSessionRepository.findOne(
      authSessionFindDTO
    );

    return authSession;
  }

  private async deleteAuthSession(authSession: AuthSession): Promise<void> {
    const deletionDTO: AuthSessionDeletionDTO = {
      id: authSession.id,
    };

    await this.authSessionRepository.delete(deletionDTO);
  }
}

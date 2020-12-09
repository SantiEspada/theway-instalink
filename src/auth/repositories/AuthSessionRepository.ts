import { AuthSession } from '../models/AuthSession';
import { AuthSessionCreationDTO } from '../models/AuthSessionCreationDTO';
import { AuthSessionDeletionDTO } from '../models/AuthSessionDeletionDTO';
import { AuthSessionFindDTO } from '../models/AuthSessionFindDTO';

export interface AuthSessionRepository {
  create(creationDTO: AuthSessionCreationDTO): Promise<AuthSession>;
  findOne(findDTO: AuthSessionFindDTO): Promise<AuthSession>;
  delete(deletionDTO: AuthSessionDeletionDTO): Promise<void>;
}

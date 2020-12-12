import { AuthToken } from '../models/AuthToken';
import { AuthTokenSigningDTO } from '../models/AuthTokenSigningDTO';
import { AuthTokenVerificationDTO } from '../models/AuthTokenVerificationDTO';

export interface AuthTokenService {
  signToken(authTokenSigningDTO: AuthTokenSigningDTO): string;
  verifyToken(authTokenVerificationDTO: AuthTokenVerificationDTO): AuthToken;
}

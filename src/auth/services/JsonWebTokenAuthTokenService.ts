import jwt from 'jsonwebtoken';
import { StatusCodes } from 'http-status-codes';

import { AuthTokenService } from './AuthTokenService';
import { AuthTokenSigningDTO } from '../models/AuthTokenSigningDTO';
import { AuthTokenVerificationDTO } from '../models/AuthTokenVerificationDTO';
import { AuthToken } from '../models/AuthToken';
import { ApiError } from '../../common/models/ApiError';

interface JsonWebTokenAuthTokenServiceConfig {
  secret: string;
  expirationTimeSecs?: string;
}

export class JsonWebTokenAuthTokenService implements AuthTokenService {
  private readonly config: JsonWebTokenAuthTokenServiceConfig;

  constructor(env = process.env) {
    this.config = {
      secret: env.JWT_SECRET,
      expirationTimeSecs: env.JWT_EXPIRATION_TIME_SECS,
    };
  }

  public signToken(authTokenSigningDTO: AuthTokenSigningDTO): string {
    const token = jwt.sign(authTokenSigningDTO, this.config.secret, {
      subject: authTokenSigningDTO.email,
      expiresIn: this.config.expirationTimeSecs,
    });

    return token;
  }

  public verifyToken(verificationDTO: AuthTokenVerificationDTO): AuthToken {
    const { token } = verificationDTO;

    try {
      const verifiedToken = jwt.verify(token, this.config.secret) as object;

      const authToken = this.adaptJwtTokenToAuthToken(verifiedToken);

      return authToken;
    } catch (err) {
      throw new ApiError('Invalid/expired token', StatusCodes.FORBIDDEN);
    }
  }

  public adaptJwtTokenToAuthToken(jwtToken: any): AuthToken {
    const { sessionId, email, exp } = jwtToken;

    const expiresAt = new Date(exp);

    const authToken: AuthToken = {
      sessionId,
      email,
      expiresAt,
    };

    return authToken;
  }
}

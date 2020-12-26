import { StatusCodes } from 'http-status-codes';
import { Describe, is, object, string } from 'superstruct';

import { RequestHandler } from '../../common/modules/RequestHandler';
import { VerifyAuthSessionInteractor } from '../interactors/VerifyAuthSessionInteractor';
import {
  ApiRequestMethod,
  PostApiRequest,
} from '../../common/models/ApiRequest';
import { ApiResponse } from '../../common/models/ApiResponse';
import { ApiError } from '../../common/models/ApiError';

export interface AuthSessionsSessionIdVerifyRequestBody {
  id: string;
  email: string;
  nonce: string;
}

export interface AuthSessionsSessionIdVerifyRequestResponse {
  token: string;
}

export class AuthSessionsSessionIdVerifyRequestHandler extends RequestHandler {
  protected allowedMethods: ApiRequestMethod[] = [ApiRequestMethod.POST];
  protected publicMethods: ApiRequestMethod[] = [ApiRequestMethod.POST];

  constructor(
    private readonly verifyAuthSessionInteractor: VerifyAuthSessionInteractor = new VerifyAuthSessionInteractor()
  ) {
    super();
  }

  protected async handlePost(request: PostApiRequest): Promise<ApiResponse> {
    if (!this.isValidBody(request.body)) {
      throw new ApiError('Invalid body', StatusCodes.BAD_REQUEST);
    }

    const { token } = await this.verifyAuthSessionInteractor.interact(
      request.body
    );

    const content: AuthSessionsSessionIdVerifyRequestResponse = {
      token,
    };

    const apiResponse: ApiResponse = {
      content,
    };

    return apiResponse;
  }

  private isValidBody(
    value: unknown
  ): value is AuthSessionsSessionIdVerifyRequestBody {
    const schema: Describe<AuthSessionsSessionIdVerifyRequestBody> = object({
      id: string(),
      email: string(),
      nonce: string(),
    });

    return is(value, schema);
  }
}

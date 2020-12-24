import { StatusCodes } from 'http-status-codes';
import { Describe, is, object, string } from 'superstruct';

import { RequestHandler } from '../../common/modules/RequestHandler';
import { CreateAuthSessionInteractor } from '../interactors/CreateAuthSessionInteractor';
import {
  ApiRequestMethod,
  PostApiRequest,
} from '../../common/models/ApiRequest';
import { ApiResponse } from '../../common/models/ApiResponse';
import { ApiError } from '../../common/models/ApiError';

export interface AuthSessionsRequestBody {
  email: string;
}

export interface AuthSessionsRequestResponse {
  email: string;
  nonce: string;
}

export class AuthSessionsRequestHandler extends RequestHandler {
  protected allowedMethods: ApiRequestMethod[] = [ApiRequestMethod.POST];
  protected isPublic: boolean = true;

  constructor(
    private readonly createAuthSessionInteractor: CreateAuthSessionInteractor = new CreateAuthSessionInteractor()
  ) {
    super();
  }

  protected async handlePost(request: PostApiRequest): Promise<ApiResponse> {
    if (!this.isValidBody(request.body)) {
      throw new ApiError('Invalid body', StatusCodes.BAD_REQUEST);
    }

    const { email: originalEmail } = request.body;

    const { email, nonce } = await this.createAuthSessionInteractor.interact({
      email: originalEmail,
    });

    const content: AuthSessionsRequestResponse = {
      email,
      nonce,
    };

    return {
      statusCode: StatusCodes.OK,
      content,
    };
  }

  private isValidBody(value: unknown): value is AuthSessionsRequestBody {
    const schema: Describe<AuthSessionsRequestBody> = object({
      email: string(),
    });

    return is(value, schema);
  }
}

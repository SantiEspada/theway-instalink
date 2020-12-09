import { StatusCodes } from 'http-status-codes';
import { ApiError } from 'next/dist/next-server/server/api-utils';
import { Describe, is, object, string } from 'superstruct';

import { RequestHandler } from '../../common/modules/RequestHandler';
import { CreateAuthSessionInteractor } from '../interactors/CreateAuthSessionInteractor';
import {
  ApiRequestMethod,
  PostApiRequest,
} from '../../common/models/ApiRequest';
import { ApiResponse } from '../../common/models/ApiResponse';

interface AuthSessionsRequestBody {
  email: string;
}

export class AuthSessionsRequestHandler extends RequestHandler {
  protected allowedMethods: ApiRequestMethod[] = [ApiRequestMethod.POST];

  constructor(
    private readonly createAuthSessionInteractor: CreateAuthSessionInteractor = new CreateAuthSessionInteractor()
  ) {
    super();
  }

  protected async handlePost(request: PostApiRequest): Promise<ApiResponse> {
    if (!this.isValidBody(request.body)) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Invalid body');
    }

    const { email } = request.body;

    await this.createAuthSessionInteractor.interact({
      email,
    });

    return {
      statusCode: StatusCodes.NO_CONTENT,
      content: '',
    };
  }

  private isValidBody(value: unknown): value is AuthSessionsRequestBody {
    console.log(value);

    const schema: Describe<AuthSessionsRequestBody> = object({
      email: string(),
    });

    return is(value, schema);
  }
}

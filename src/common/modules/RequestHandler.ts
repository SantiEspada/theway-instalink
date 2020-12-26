import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import { AuthTokenService } from '../../auth/services/AuthTokenService';
import { JsonWebTokenAuthTokenService } from '../../auth/services/JsonWebTokenAuthTokenService';
import { ApiError } from '../models/ApiError';

import {
  ApiRequest,
  ApiRequestMethod,
  GetApiRequest,
  PostApiRequest,
} from '../models/ApiRequest';
import { ApiResponse } from '../models/ApiResponse';

export abstract class RequestHandler {
  protected abstract allowedMethods: ApiRequestMethod[];
  protected publicMethods: ApiRequestMethod[] = [];

  constructor(
    private readonly authTokenservice: AuthTokenService = new JsonWebTokenAuthTokenService()
  ) {}

  public async handle(request: ApiRequest): Promise<ApiResponse> {
    const isRequestMethodAllowed = this.allowedMethods.includes(request.method);

    if (!isRequestMethodAllowed) {
      return this.handleNotAllowedMethod();
    }

    let response: ApiResponse;

    try {
      const isPublic = this.publicMethods.includes(request.method);

      const isAuthorized =
        isPublic || (await this.isRequestAuthorized(request));

      if (isAuthorized) {
        switch (request.method) {
          case ApiRequestMethod.GET:
            response = await this.handleGet(request);
            break;
          case ApiRequestMethod.POST:
            response = await this.handlePost(request);
            break;
          default:
            response = this.handleNotAllowedMethod();
        }
      }
    } catch (err) {
      response = this.handleError(err);
    }

    return response;
  }

  protected async handleGet(request: GetApiRequest): Promise<ApiResponse> {
    throw new ApiError(
      ReasonPhrases.NOT_IMPLEMENTED,
      StatusCodes.NOT_IMPLEMENTED
    );
  }

  protected async handlePost(request: PostApiRequest): Promise<ApiResponse> {
    throw new ApiError(
      ReasonPhrases.NOT_IMPLEMENTED,
      StatusCodes.NOT_IMPLEMENTED
    );
  }

  private handleNotAllowedMethod(): ApiResponse {
    const apiResponse: ApiResponse = {
      statusCode: StatusCodes.METHOD_NOT_ALLOWED,
      content: {
        error: ReasonPhrases.METHOD_NOT_ALLOWED,
      },
      headers: {
        Allow: this.allowedMethods.join(', '),
      },
    };

    return apiResponse;
  }

  private handleError(originalError: any): ApiResponse {
    let error: ApiError;

    if (originalError instanceof ApiError) {
      error = originalError;
    } else {
      error = new ApiError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        originalError.message
      );
    }

    const apiResponse: ApiResponse = {
      statusCode: error.statusCode,
      content: {
        error: error.message,
      },
    };

    return apiResponse;
  }

  private async isRequestAuthorized(
    request: ApiRequest
  ): Promise<true | never> {
    if (request.headers && 'authorization' in request.headers) {
      const token = request.headers.authorization.split('Bearer ')[1];

      if (this.authTokenservice.verifyToken({ token })) {
        return true;
      }
    } else {
      throw new ApiError(
        'Authorization not present in request',
        StatusCodes.UNAUTHORIZED
      );
    }
  }
}

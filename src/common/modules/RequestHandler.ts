import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import { ApiError } from 'next/dist/next-server/server/api-utils';

import {
  ApiRequest,
  ApiRequestMethod,
  GetApiRequest,
  PostApiRequest,
} from '../models/ApiRequest';
import { ApiResponse } from '../models/ApiResponse';

export abstract class RequestHandler {
  protected allowedMethods: ApiRequestMethod[] = [
    ApiRequestMethod.GET,
    ApiRequestMethod.POST,
  ];

  protected async handle(request: ApiRequest): Promise<ApiResponse> {
    let response: ApiResponse;

    const isRequestMethodAllowed = this.allowedMethods.includes(request.method);

    if (!isRequestMethodAllowed) {
      response = this.handleNotAllowedMethod();
    }

    try {
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
    } catch (err) {
      response = this.handleError(err);
    }

    return response;
  }

  protected async handleGet(request: GetApiRequest): Promise<ApiResponse> {
    throw new ApiError(
      StatusCodes.NOT_IMPLEMENTED,
      ReasonPhrases.NOT_IMPLEMENTED
    );
  }

  protected async handlePost(request: PostApiRequest): Promise<ApiResponse> {
    throw new ApiError(
      StatusCodes.NOT_IMPLEMENTED,
      ReasonPhrases.NOT_IMPLEMENTED
    );
  }

  private handleNotAllowedMethod(): ApiResponse {
    const apiResponse: ApiResponse = {
      statusCode: StatusCodes.METHOD_NOT_ALLOWED,
      content: StatusCodes.METHOD_NOT_ALLOWED,
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
}

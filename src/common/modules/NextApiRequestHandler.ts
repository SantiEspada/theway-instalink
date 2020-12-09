import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';

import {
  ApiRequest,
  ApiRequestMethod,
  GetApiRequest,
  PostApiRequest,
} from '../models/ApiRequest';
import { ApiResponse } from '../models/ApiResponse';
import { RequestHandler } from './RequestHandler';

export abstract class NextApiRequestHandler extends RequestHandler {
  public get handler(): NextApiHandler {
    const nextApiHandler: NextApiHandler = async (
      req: NextApiRequest,
      res: NextApiResponse
    ) => {
      const apiRequest = this.adaptNextApiRequestToApiRequest(req);

      const apiResponse = await this.handle(apiRequest);

      this.handleApiResponse(apiResponse, res);
    };

    return nextApiHandler;
  }

  private adaptNextApiRequestToApiRequest(
    nextApiRequest: NextApiRequest
  ): ApiRequest {
    let apiRequest: ApiRequest;

    switch (nextApiRequest.method) {
      case ApiRequestMethod.GET:
        apiRequest = this.adaptNextApiRequestToGetApiRequest(nextApiRequest);
      case ApiRequestMethod.POST:
        apiRequest = this.adaptNextApiRequestToPostApiRequest(nextApiRequest);
      default:
        apiRequest = this.adaptNextApiRequestToNotAllowedMethod(nextApiRequest);
    }

    return apiRequest;
  }

  private adaptNextApiRequestToGetApiRequest(
    nextApiRequest: NextApiRequest
  ): GetApiRequest {
    const apiRequest: GetApiRequest = {
      method: ApiRequestMethod.GET,
      query: nextApiRequest.query,
    };

    return apiRequest;
  }

  private adaptNextApiRequestToPostApiRequest(
    nextApiRequest: NextApiRequest
  ): PostApiRequest {
    const apiRequest: PostApiRequest = {
      method: ApiRequestMethod.POST,
      body: nextApiRequest.body,
    };

    return apiRequest;
  }

  private adaptNextApiRequestToNotAllowedMethod(
    nextApiRequest: NextApiRequest
  ): ApiRequest {
    // This is a partial ApiRequest with an unknown/unimplemented method, but that will be handled by the RequestHandler itself
    const apiRequest = {
      method: nextApiRequest.method,
    } as ApiRequest;

    return apiRequest;
  }

  private handleApiResponse(apiResponse: ApiResponse, res: NextApiResponse) {
    res.statusCode = apiResponse.statusCode || 200;

    if (apiResponse.headers) {
      for (const [key, value] of Object.entries(apiResponse.headers)) {
        res.setHeader(key, value);
      }
    }

    res.end(apiResponse.content ? JSON.stringify(apiResponse.content) : '');
  }
}

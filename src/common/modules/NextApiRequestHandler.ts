import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';

import {
  ApiRequest,
  ApiRequestMethod,
  GetApiRequest,
  PostApiRequest,
} from '../models/ApiRequest';
import { ApiResponse } from '../models/ApiResponse';
import { RequestHandler } from './RequestHandler';

export class NextApiRequestHandler<TRequestHandler extends RequestHandler> {
  constructor(private readonly requestHandler: TRequestHandler) {}

  public get handler(): NextApiHandler {
    const nextApiHandler: NextApiHandler = async (
      req: NextApiRequest,
      res: NextApiResponse
    ) => {
      const apiRequest = this.adaptNextApiRequestToApiRequest(req);

      const apiResponse = await this.requestHandler.handle(apiRequest);

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
        break;
      case ApiRequestMethod.POST:
        apiRequest = this.adaptNextApiRequestToPostApiRequest(nextApiRequest);
        break;
      default:
        apiRequest = this.adaptNextApiRequestToNotAllowedMethod(nextApiRequest);
        break;
    }

    return apiRequest;
  }

  private adaptNextApiRequestToGetApiRequest(
    nextApiRequest: NextApiRequest
  ): GetApiRequest {
    const apiRequest: GetApiRequest = {
      method: ApiRequestMethod.GET,
      headers: nextApiRequest.headers as Record<string, string>,
      query: nextApiRequest.query,
    };

    return apiRequest;
  }

  private adaptNextApiRequestToPostApiRequest(
    nextApiRequest: NextApiRequest
  ): PostApiRequest {
    const apiRequest: PostApiRequest = {
      method: ApiRequestMethod.POST,
      headers: nextApiRequest.headers as Record<string, string>,
      body: { ...nextApiRequest.query, ...nextApiRequest.body },
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

    res.setHeader('Content-Type', 'application/json');

    if (apiResponse.headers) {
      for (const [key, value] of Object.entries(apiResponse.headers)) {
        res.setHeader(key, value);
      }
    }

    res.end(apiResponse.content ? JSON.stringify(apiResponse.content) : '');
  }
}

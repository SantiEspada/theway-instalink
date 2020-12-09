export enum ApiRequestMethod {
  GET = 'GET',
  POST = 'POST',
}

interface BaseApiRequest {
  method: ApiRequestMethod;
}

export interface GetApiRequest extends BaseApiRequest {
  method: ApiRequestMethod.GET;
  query?: Record<string, string | string[]>;
}

export interface PostApiRequest extends BaseApiRequest {
  method: ApiRequestMethod.POST;
  body?: any;
}

export type ApiRequest = GetApiRequest | PostApiRequest;

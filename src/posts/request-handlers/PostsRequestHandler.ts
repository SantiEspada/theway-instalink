import { StatusCodes } from 'http-status-codes';
import { Describe, enums, is, object } from 'superstruct';

import {
  FindPostsInput,
  FindPostsInteractor,
  FindPostsOutput,
} from '../interactors/FindPostsInteractor';
import { RequestHandler } from '../../common/modules/RequestHandler';
import {
  ApiRequestMethod,
  GetApiRequest,
} from '../../common/models/ApiRequest';
import { ApiResponse } from '../../common/models/ApiResponse';
import { PostSource } from '../models/Post';
import { ApiError } from '../../common/models/ApiError';

export type PostsRequestHandlerRequestQuery = FindPostsInput;
export type PostsSyncRequestHandlerRequestResponse = FindPostsOutput;

export class PostsRequestHandler extends RequestHandler {
  protected allowedMethods: ApiRequestMethod[] = [ApiRequestMethod.GET];

  constructor(
    private readonly findPostsInteractor: FindPostsInteractor = new FindPostsInteractor()
  ) {
    super();
  }

  protected async handleGet(request: GetApiRequest): Promise<ApiResponse> {
    if (!this.isValidQuery(request.query)) {
      throw new ApiError('Invalid query', StatusCodes.BAD_REQUEST);
    }

    const { source } = request.query;

    const postList = await this.findPostsInteractor.interact({ source });

    const apiResponse: ApiResponse = {
      statusCode: StatusCodes.OK,
      content: postList,
    };

    return apiResponse;
  }

  private isValidQuery(
    value: unknown
  ): value is PostsRequestHandlerRequestQuery {
    const schema: Describe<PostsRequestHandlerRequestQuery> = object({
      source: enums([PostSource.blog, PostSource.instagram]),
    });

    return is(value, schema);
  }
}

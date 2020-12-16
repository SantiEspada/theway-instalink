import { StatusCodes } from 'http-status-codes';
import { array, Describe, enums, is, object, string } from 'superstruct';

import { ApiError } from '../../common/models/ApiError';
import {
  ApiRequestMethod,
  PostApiRequest,
} from '../../common/models/ApiRequest';
import { ApiResponse } from '../../common/models/ApiResponse';
import { RequestHandler } from '../../common/modules/RequestHandler';
import { SyncExternalPostsInteractor } from '../interactors/SyncExternalPostsInteractor';
import { PostSource } from '../models/Post';

export interface PostsSyncRequestHandlerRequestBody {
  sources: PostSource[];
}

export interface PostsSyncRequestHandlerRequestResponse {}

export class PostsSyncRequestHandler extends RequestHandler {
  protected allowedMethods: ApiRequestMethod[] = [ApiRequestMethod.POST];

  constructor(
    private readonly syncExternalPostsInteractor: SyncExternalPostsInteractor = new SyncExternalPostsInteractor()
  ) {
    super();
  }

  protected async handlePost(request: PostApiRequest): Promise<ApiResponse> {
    if (!this.isValidBody(request.body)) {
      throw new ApiError('Invalid body', StatusCodes.BAD_REQUEST);
    }

    const { sources } = request.body;

    await this.syncExternalPostsInteractor.interact({ sources });

    const apiResponse: ApiResponse = {
      statusCode: StatusCodes.NO_CONTENT,
      content: '',
    };

    return apiResponse;
  }

  private isValidBody(
    value: unknown
  ): value is PostsSyncRequestHandlerRequestBody {
    const schema: Describe<PostsSyncRequestHandlerRequestBody> = object({
      sources: array(enums([PostSource.blog])),
    });

    return is(value, schema);
  }
}

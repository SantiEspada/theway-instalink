import { StatusCodes } from 'http-status-codes';
import { Describe, is, object, string } from 'superstruct';

import {
  CreateLinkInput,
  CreateLinkOutput,
  CreateLinkInteractor,
} from '../interactors/CreateLinkInteractor';
import { RequestHandler } from '../../common/modules/RequestHandler';
import {
  ApiRequestMethod,
  PostApiRequest,
} from '../../common/models/ApiRequest';
import { ApiResponse } from '../../common/models/ApiResponse';
import { ApiError } from '../../common/models/ApiError';

export type LinksRequestBody = CreateLinkInput;
export type LinksRequestResponse = CreateLinkOutput;

export class LinkRequestHandler extends RequestHandler {
  protected allowedMethods: ApiRequestMethod[] = [ApiRequestMethod.POST];

  constructor(
    private readonly createLinkInteractor: CreateLinkInteractor = new CreateLinkInteractor()
  ) {
    super();
  }

  protected async handlePost(request: PostApiRequest): Promise<ApiResponse> {
    if (!this.isValidBody(request.body)) {
      throw new ApiError('Invalid body', StatusCodes.BAD_REQUEST);
    }

    const link = await this.createLinkInteractor.interact(request.body);

    const apiResponse: ApiResponse = {
      statusCode: StatusCodes.OK,
      content: link,
    };

    return apiResponse;
  }

  private isValidBody(value: unknown): value is LinksRequestBody {
    const schema: Describe<LinksRequestBody> = object({
      sourcePostId: string(),
      destinationPostId: string(),
    });

    return is(value, schema);
  }
}

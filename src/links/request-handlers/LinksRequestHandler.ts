import { StatusCodes } from 'http-status-codes';
import { Describe, enums, is, object, optional, string } from 'superstruct';

import {
  CreateLinkInput,
  CreateLinkOutput,
  CreateLinkInteractor,
} from '../interactors/CreateLinkInteractor';
import { RequestHandler } from '../../common/modules/RequestHandler';
import {
  ApiRequestMethod,
  GetApiRequest,
  PostApiRequest,
} from '../../common/models/ApiRequest';
import { ApiResponse } from '../../common/models/ApiResponse';
import { ApiError } from '../../common/models/ApiError';
import {
  FindLinksInput,
  FindLinksInteractor,
  FindLinksOutput,
} from '../interactors/FindLinksInteractor';
import { SortDirection } from '../../common/models/SortDirection';
import { Link } from '../models/Link';

export type LinksRequestQuery = {
  sortBy?: keyof Link;
  sortDirection?: SortDirection;
};
export type LinksRequestBody = CreateLinkInput;
export type LinksRequestResponse = CreateLinkOutput | FindLinksOutput;

export class LinkRequestHandler extends RequestHandler {
  protected allowedMethods: ApiRequestMethod[] = [
    ApiRequestMethod.GET,
    ApiRequestMethod.POST,
  ];
  protected publicMethods: ApiRequestMethod[] = [ApiRequestMethod.GET];

  constructor(
    private readonly findLinksInteractor: FindLinksInteractor = new FindLinksInteractor(),
    private readonly createLinkInteractor: CreateLinkInteractor = new CreateLinkInteractor()
  ) {
    super();
  }

  protected async handleGet(request: GetApiRequest): Promise<ApiResponse> {
    if (!this.isValidQuery(request.query)) {
      throw new ApiError('Invalid query', StatusCodes.BAD_REQUEST);
    }

    const { sortBy, sortDirection } = request.query;

    let sort: FindLinksInput['sort'] | undefined;

    if (sortBy && sortDirection) {
      sort = {
        by: sortBy as keyof Link,
        direction: Number(sortDirection),
      };
    }

    const linkList = await this.findLinksInteractor.interact({ sort });

    const apiResponse: ApiResponse = {
      statusCode: StatusCodes.OK,
      content: linkList,
    };

    return apiResponse;
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

  private isValidQuery(value: unknown): value is LinksRequestQuery {
    // FIXME: THis should typed as Describe<LinksRequestQuery>, but sortDirection fails for some reason
    const schema = object({
      sortBy: optional(
        enums([
          'sourcePostId',
          'publishedAt',
          'title',
          'destinationUrl',
          'pictureUrl',
          'stats',
          'id',
          'createdAt',
        ])
      ),
      sortDirection: optional(
        enums([SortDirection.asc.toString(), SortDirection.desc.toString()])
      ),
    });

    return is(value, schema);
  }

  private isValidBody(value: unknown): value is LinksRequestBody {
    const schema: Describe<LinksRequestBody> = object({
      sourcePostId: string(),
      destinationPostId: string(),
    });

    return is(value, schema);
  }
}

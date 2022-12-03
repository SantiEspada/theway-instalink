import { StatusCodes } from 'http-status-codes';
import {
  ApiRequestMethod,
  GetApiRequest,
  PostApiRequest,
} from '../../common/models/ApiRequest';
import { ApiResponse } from '../../common/models/ApiResponse';
import { RequestHandler } from '../../common/modules/RequestHandler';
import { CreateInstagramCredentialInteractor } from '../interactors/CreateInstagramCredentialInteractor';
import { RefreshInstagramCredentialInteractor } from '../interactors/RefreshInstagramCredentialInteractor';

export type InstagramOauthRequestHandlerRequestBody = void;
export type InstagramOauthRequestHandlerRequestResponse = void;

export class InstagramOauthRequestHandler extends RequestHandler {
  protected allowedMethods: ApiRequestMethod[] = [
    ApiRequestMethod.GET,
    ApiRequestMethod.POST,
  ];
  protected publicMethods: ApiRequestMethod[] = [ApiRequestMethod.GET]; // FIXME: this should not be public? although not too critical. Needs cookie auth.

  private readonly BASE_URL: string;

  constructor(
    env = process.env,
    private readonly createInstagramCredentialInteractor: CreateInstagramCredentialInteractor = new CreateInstagramCredentialInteractor(),
    private readonly refreshInstagramCredentialInteractor: RefreshInstagramCredentialInteractor = new RefreshInstagramCredentialInteractor()
  ) {
    super();

    this.BASE_URL = env.BASE_URL;
  }

  protected async handleGet(request: GetApiRequest): Promise<ApiResponse> {
    const { code } = request.query;

    if (!code) {
      const apiResponse: ApiResponse = {
        content: 'Invalid/missing code',
        statusCode: StatusCodes.BAD_REQUEST,
      };

      return apiResponse;
    }

    await this.createInstagramCredentialInteractor.interact({
      oauthCode: code as string,
    });

    const apiResponse: ApiResponse = {
      content: '',
      statusCode: StatusCodes.MOVED_TEMPORARILY,
      headers: {
        location: new URL('backstage', this.BASE_URL).href,
      },
    };

    return apiResponse;
  }

  // FIXME: this should *not* be here definitely, it should be on its own endpoint
  protected async handlePost(request: PostApiRequest): Promise<ApiResponse> {
    await this.refreshInstagramCredentialInteractor.interact();

    const apiResponse: ApiResponse = {
      content: '',
      statusCode: StatusCodes.NO_CONTENT,
    };

    return apiResponse;
  }
}

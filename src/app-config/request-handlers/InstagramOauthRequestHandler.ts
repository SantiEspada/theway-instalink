import { StatusCodes } from 'http-status-codes';
import {
  ApiRequestMethod,
  GetApiRequest,
} from '../../common/models/ApiRequest';
import { ApiResponse } from '../../common/models/ApiResponse';
import { RequestHandler } from '../../common/modules/RequestHandler';
import { CreateInstagramCredentialInteractor } from '../interactors/CreateInstagramCredentialInteractor';

export type InstagramOauthRequestHandlerRequestBody = void;
export type InstagramOauthRequestHandlerRequestResponse = void;

export class InstagramOauthRequestHandler extends RequestHandler {
  protected allowedMethods: ApiRequestMethod[] = [ApiRequestMethod.GET];
  protected publicMethods: ApiRequestMethod[] = [ApiRequestMethod.GET]; // FIXME: this should not be public? although not too critical. Needs cookie auth.

  private readonly BASE_URL: string;

  constructor(
    env = process.env,
    private readonly createInstagramCredentialInteractor: CreateInstagramCredentialInteractor = new CreateInstagramCredentialInteractor()
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

    const instagramCredential =
      await this.createInstagramCredentialInteractor.interact({
        oauthCode: code as string,
      });

    const apiResponse: ApiResponse = {
      content: instagramCredential,
      statusCode: StatusCodes.MOVED_TEMPORARILY,
      headers: {
        location: new URL('backstage', this.BASE_URL).href,
      },
    };

    return apiResponse;
  }
}

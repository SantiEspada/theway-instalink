import {
  ApiRequestMethod,
  GetApiRequest,
  PostApiRequest,
} from '../../common/models/ApiRequest';
import { ApiResponse } from '../../common/models/ApiResponse';
import { RequestHandler } from '../../common/modules/RequestHandler';
import { CreateAppConfigInteractor } from '../interactors/CreateAppConfigInteractor';
import { GetAppConfigInteractor } from '../interactors/GetAppConfigInteractor';
import { AppConfig } from '../models/AppConfig';
import { AppConfigCreationDTO } from '../models/AppConfigCreationDTO';

export type AppConfigsRequestHandlerRequestBody = AppConfigCreationDTO;
export type AppConfigsRequestHandlerRequestResponse = AppConfig;

export class AppConfigsRequestHandler extends RequestHandler {
  protected allowedMethods: ApiRequestMethod[] = [
    ApiRequestMethod.GET,
    ApiRequestMethod.POST,
  ];

  constructor(
    private readonly getAppConfigInteractor: GetAppConfigInteractor = new GetAppConfigInteractor(),
    private readonly createAppConfigInteractor: CreateAppConfigInteractor = new CreateAppConfigInteractor()
  ) {
    super();
  }

  protected async handleGet(_request: GetApiRequest): Promise<ApiResponse> {
    const appConfig = await this.getAppConfigInteractor.interact();

    const apiResponse: ApiResponse = {
      content: appConfig,
    };

    return apiResponse;
  }

  protected async handlePost(request: PostApiRequest): Promise<ApiResponse> {
    const { body } = request.body;

    const appConfig = await this.createAppConfigInteractor.interact(body);

    const apiResponse: ApiResponse = {
      content: appConfig,
    };

    return apiResponse;
  }
}

import { StatusCodes } from 'http-status-codes';
import { ApiError } from '../../common/models/ApiError';
import { Interactor } from '../../common/modules/Interactor';
import { AppConfig } from '../models/AppConfig';
import { AppConfigRepository } from '../repositories/AppConfigRepository';
import { MongoDBAppConfigRepository } from '../repositories/MongoDBAppConfigRepository';

export type GetAppConfigInput = void;
export type GetAppConfigOutput = AppConfig;

export class GetAppConfigInteractor
  implements Interactor<GetAppConfigInput, GetAppConfigOutput>
{
  constructor(
    private readonly appConfigRepository: AppConfigRepository = new MongoDBAppConfigRepository()
  ) {}

  public async interact(
    _input: GetAppConfigInput
  ): Promise<GetAppConfigOutput> {
    const appConfig = await this.appConfigRepository.findLast();

    if (!appConfig) {
      throw new ApiError(
        'Fatal error: cannot get AppConfig',
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }

    return appConfig;
  }
}

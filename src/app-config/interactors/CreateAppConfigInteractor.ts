import { StatusCodes } from 'http-status-codes';
import { ApiError } from '../../common/models/ApiError';
import { Interactor } from '../../common/modules/Interactor';
import { AppConfig } from '../models/AppConfig';
import { AppConfigCreationDTO } from '../models/AppConfigCreationDTO';
import { AppConfigRepository } from '../repositories/AppConfigRepository';
import { MongoDBAppConfigRepository } from '../repositories/MongoDBAppConfigRepository';

export type CreateAppConfigInput = Partial<AppConfigCreationDTO>;

export type CreateAppConfigOutput = AppConfig;

export class CreateAppConfigInteractor
  implements Interactor<CreateAppConfigInput, CreateAppConfigOutput>
{
  constructor(
    private readonly appConfigRepository: AppConfigRepository = new MongoDBAppConfigRepository()
  ) {}

  public async interact(
    input: CreateAppConfigInput
  ): Promise<CreateAppConfigOutput> {
    const currentAppConfig = await this.getCurrentAppConfig();

    const appConfigToCreate = {
      ...currentAppConfig,
      ...input,
    };

    if (!this.validateAppConfig(appConfigToCreate)) {
      throw new Error('Invalid app config');
    }

    const newAppConfig = await this.appConfigRepository.create(
      appConfigToCreate
    );

    return newAppConfig;
  }

  private async getCurrentAppConfig(): Promise<Partial<AppConfigCreationDTO>> {
    try {
      const currentAppConfig = await this.appConfigRepository.findLast();

      delete currentAppConfig.id;
      delete currentAppConfig.createdAt;

      return currentAppConfig;
    } catch (error) {
      return {};
    }
  }

  private validateAppConfig(
    appConfig: Partial<AppConfigCreationDTO>
  ): appConfig is AppConfigCreationDTO | never {
    if (!appConfig.instagramCredential) {
      throw new ApiError(
        'InstagramCredential missing in creation DTO',
        StatusCodes.BAD_REQUEST
      );
    }

    return true;
  }
}

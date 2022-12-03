import * as MongoDb from 'mongodb';
import { nanoid } from 'nanoid';

import { MongoDBDatasource } from '../../common/datasources/MongoDBDatasource';
import { AppConfigRepository } from './AppConfigRepository';
import { AppConfig } from '../models/AppConfig';
import { AppConfigCreationDTO } from '../models/AppConfigCreationDTO';
import { ApiError } from '../../common/models/ApiError';
import { StatusCodes } from 'http-status-codes';
import { SortDirection } from '../../common/models/SortDirection';

export class MongoDBAppConfigRepository implements AppConfigRepository {
  private readonly dbCollection = 'app_config';

  constructor(
    private readonly datasource: MongoDBDatasource = new MongoDBDatasource()
  ) {}

  private async getCollection(): Promise<MongoDb.Collection> {
    const db = await this.datasource.getClient();

    const collection = db.collection(this.dbCollection);

    return collection;
  }

  public async create(creationDTO: AppConfigCreationDTO): Promise<AppConfig> {
    const collection = await this.getCollection();

    const id = nanoid();
    const createdAt = new Date();

    const appConfigToCreate: AppConfig = {
      id,
      createdAt,
      ...creationDTO,
    };

    await collection.insertOne(appConfigToCreate);

    const createdAppConfig = await this.findLast();

    return createdAppConfig;
  }

  public async findLast(): Promise<AppConfig> {
    const collection = await this.getCollection();

    const document = await collection.findOne(
      {},
      {
        sort: {
          _id: SortDirection.desc,
        },
      }
    );

    if (!document) {
      throw new ApiError('AppConfig not found', StatusCodes.NOT_FOUND);
    }

    const appconfig = this.adaptDocumentToAppConfig(document);

    return appconfig;
  }

  private adaptDocumentToAppConfig(document: any): AppConfig {
    const appconfig: AppConfig = {
      id: document.id,
      createdAt: document.createdAt,
      instagramCredential: { ...document.instagramCredential },
    };

    return appconfig;
  }
}

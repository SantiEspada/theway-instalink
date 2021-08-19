import * as MongoDb from 'mongodb';
import { nanoid } from 'nanoid';

import { MongoDBDatasource } from '../../common/datasources/MongoDBDatasource';
import { AuthSession } from '../models/AuthSession';
import { AuthSessionCreationDTO } from '../models/AuthSessionCreationDTO';
import { AuthSessionDeletionDTO } from '../models/AuthSessionDeletionDTO';
import { AuthSessionFindDTO } from '../models/AuthSessionFindDTO';
import { AuthSessionRepository } from './AuthSessionRepository';

export class MongoDBAuthSessionRepository implements AuthSessionRepository {
  private readonly dbCollection = 'auth_sessions';

  constructor(
    private readonly datasource: MongoDBDatasource = new MongoDBDatasource()
  ) {}

  private async getCollection(): Promise<MongoDb.Collection> {
    const db = await this.datasource.getClient();

    const collection = db.collection(this.dbCollection);

    return collection;
  }

  public async create(
    creationDTO: AuthSessionCreationDTO
  ): Promise<AuthSession> {
    const collection = await this.getCollection();

    const id = nanoid();
    const createdAt = new Date();

    await collection.insertOne({
      id,
      createdAt,
      ...creationDTO,
    });

    const authSession = await this.findOne({ id });

    return authSession;
  }

  public async findOne(findDTO: AuthSessionFindDTO): Promise<AuthSession> {
    const collection = await this.getCollection();

    const document = await collection.findOne({ id: findDTO.id });

    const authSession = this.adaptDocumentToAuthSession(document);

    return authSession;
  }

  public async delete(deletionDTO: AuthSessionDeletionDTO): Promise<void> {
    const collection = await this.getCollection();

    await collection.deleteOne({ id: deletionDTO.id });
  }

  private adaptDocumentToAuthSession(document: any): AuthSession {
    const authSession: AuthSession = {
      id: document.id,
      createdAt: document.createdAt,
      email: document.email,
      nonce: document.nonce,
    };

    return authSession;
  }
}

import * as MongoDb from 'mongodb';
import { nanoid } from 'nanoid';

import { MongoDBDatasource } from '../../common/datasources/MongoDBDatasource';
import { List } from '../../common/models/List';
import { LinkRepository } from './LinkRepository';
import { Link } from '../models/Link';
import { LinkCreationDTO } from '../models/LinkCreationDTO';
import { LinkFindDTO } from '../models/LinkFindDTO';
import { LinkDeletionDTO } from '../models/LinkDeletionDTO';
import { ApiError } from '../../common/models/ApiError';
import { StatusCodes } from 'http-status-codes';
import { SortDirection } from '../../common/models/SortDirection';

export class MongoDBLinkRepository implements LinkRepository {
  private readonly dbCollection = 'links';

  constructor(
    private readonly datasource: MongoDBDatasource = new MongoDBDatasource()
  ) {}

  private async getCollection(): Promise<MongoDb.Collection> {
    const db = await this.datasource.getClient();

    const collection = db.collection(this.dbCollection);

    return collection;
  }

  public async create(creationDTO: LinkCreationDTO): Promise<Link> {
    const collection = await this.getCollection();

    const id = nanoid();
    const createdAt = new Date();

    const linkToCreate: Link = {
      id,
      createdAt,
      stats: {
        clicks: 0,
      },
      ...creationDTO,
    };

    await collection.insertOne(linkToCreate);

    const createdLink = await this.findOne({ id });

    return createdLink;
  }

  public async find(findDTO: LinkFindDTO): Promise<List<Link>> {
    const collection = await this.getCollection();

    const { limit = 0, sort, ...filterQuery } = findDTO;

    const sortBy = sort?.by || 'publishedAt';
    const sortDirection = sort?.direction || SortDirection.desc;

    const linkDocuments = await collection
      .find(filterQuery)
      .limit(limit)
      .sort(sortBy, sortDirection)
      .toArray();

    const linkList = this.adaptDocumentsToLinkList(linkDocuments);

    return linkList;
  }

  public async findOne(findDTO: LinkFindDTO): Promise<Link> {
    const collection = await this.getCollection();

    const document = await collection.findOne({ id: findDTO.id });

    if (!document) {
      throw new ApiError('Link not found', StatusCodes.NOT_FOUND);
    }

    const link = this.adaptDocumentToLink(document);

    return link;
  }

  public async delete(deletionDTO: LinkDeletionDTO): Promise<void> {
    throw new Error('Method not implemented.');
  }

  private adaptDocumentToLink(document: any): Link {
    const link: Link = {
      id: document.id,
      createdAt: document.createdAt,
      sourcePostId: document.sourcePostId,
      publishedAt: new Date(document.publishedAt),
      title: document.title,
      destinationUrl: document.destinationUrl,
      pictureUrl: document.pictureUrl,
      stats: {
        clicks: document.stats.clicks,
      },
    };

    return link;
  }

  private adaptDocumentsToLinkList(documents: any[]): List<Link> {
    const links = documents.map(this.adaptDocumentToLink);

    const linkList: List<Link> = {
      items: links,
    };

    return linkList;
  }
}

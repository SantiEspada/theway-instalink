import * as MongoDb from 'mongodb';
import { nanoid } from 'nanoid';

import { MongoDBDatasource } from '../../common/datasources/MongoDBDatasource';
import { List } from '../../common/models/List';
import { PostRepository } from './PostRepository';
import { Post, PostSource } from '../models/Post';
import { PostCreationDTO } from '../models/PostCreationDTO';
import { PostFindDTO } from '../models/PostFindDTO';
import { PostDeletionDTO } from '../models/PostDeletionDTO';
import { ApiError } from '../../common/models/ApiError';
import { StatusCodes } from 'http-status-codes';
import { SortDirection } from '../../common/models/SortDirection';

export class MongoDBPostRepository implements PostRepository {
  private readonly dbCollection = 'posts';

  constructor(
    private readonly datasource: MongoDBDatasource = new MongoDBDatasource()
  ) {}

  private async getCollection(): Promise<MongoDb.Collection> {
    const db = await this.datasource.getClient();

    const collection = db.collection(this.dbCollection);

    return collection;
  }

  public async create(creationDTO: PostCreationDTO): Promise<Post> {
    const collection = await this.getCollection();

    const id = nanoid();
    const createdAt = new Date();

    await collection.insertOne({
      id,
      createdAt,
      ...creationDTO,
    });

    const post = await this.findOne({ id });

    return post;
  }

  public async find(findDTO: PostFindDTO): Promise<List<Post>> {
    const collection = await this.getCollection();

    const { limit = 0, ...filterQuery } = findDTO;

    const postDocuments = await collection
      .find(filterQuery)
      .limit(limit)
      .sort('createdAt', SortDirection.desc)
      .toArray();

    const postList = this.adaptDocumentsToPostList(postDocuments);

    return postList;
  }

  public async findOne(findDTO: PostFindDTO): Promise<Post> {
    const collection = await this.getCollection();

    const document = await collection.findOne({ id: findDTO.id });

    if (!document) {
      throw new ApiError('Post not found', StatusCodes.NOT_FOUND);
    }

    const post = this.adaptDocumentToPost(document);

    return post;
  }

  public async delete(deletionDTO: PostDeletionDTO): Promise<void> {
    throw new Error('Method not implemented.');
  }

  private adaptDocumentToPost(document: any): Post {
    const post: Post = {
      id: document.id,
      createdAt: document.createdAt,
      source: document.source,
      title: document.title,
      url: document.url,
      pictureUrl: document.pictureUrl,
      publishedAt: document.publishedAt,
    };

    return post;
  }

  private adaptDocumentsToPostList(documents: any[]): List<Post> {
    const posts = documents.map(this.adaptDocumentToPost);

    const postList: List<Post> = {
      items: posts,
    };

    return postList;
  }
}

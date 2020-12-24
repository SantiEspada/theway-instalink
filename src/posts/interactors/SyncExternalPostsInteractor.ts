import { StatusCodes } from 'http-status-codes';
import { ApiError } from '../../common/models/ApiError';

import { Interactor } from '../../common/modules/Interactor';
import { ExternalPost } from '../models/ExternalPost';
import { PostSource } from '../models/Post';
import { MongoDBPostRepository } from '../repositories/MongoDBPostRepository';
import { PostRepository } from '../repositories/PostRepository';
import { ExternalPostService } from '../services/ExternalPostService';
import { GhostExternalPostService } from '../services/GhostExternalPostService';
import { InstagramExternalPostService } from '../services/InstagramExternalPostService';

export type SyncExternalPostsInteractorInput = {
  sources: PostSource[];
};

export type SyncExternalPostsInteractorOutput = void;

export class SyncExternalPostsInteractor
  implements
    Interactor<
      SyncExternalPostsInteractorInput,
      SyncExternalPostsInteractorOutput
    > {
  constructor(
    private readonly postRepository: PostRepository = new MongoDBPostRepository(),
    private readonly blogPostService: ExternalPostService = new GhostExternalPostService(),
    private readonly instagramPostService: ExternalPostService = new InstagramExternalPostService()
  ) {}

  public async interact(
    input: SyncExternalPostsInteractorInput
  ): Promise<SyncExternalPostsInteractorOutput> {
    const { sources } = input;

    for (const source of sources) {
      const externalPosts = await this.getExternalPosts(source);

      for (const externalPost of externalPosts) {
        const { url, title, pictureUrl, publishedAt } = externalPost;

        const postExists = await this.doesPostExist(url);

        if (!postExists) {
          await this.postRepository.create({
            source,
            url,
            pictureUrl,
            title,
            publishedAt,
          });
        }
      }
    }
  }

  private async getFromDate(source: PostSource): Promise<Date | null> {
    let fromDate: Date | null;

    try {
      const postList = await this.postRepository.find({
        source,
        limit: 1,
      });

      const latestPost = postList.items[0];

      fromDate = latestPost.publishedAt;
    } catch (err) {
      fromDate = null;
    }

    return fromDate;
  }

  private async getExternalPosts(source: PostSource): Promise<ExternalPost[]> {
    const fromDate = await this.getFromDate(source);

    switch (source) {
      case PostSource.blog:
        return this.blogPostService.getPosts(fromDate);
      case PostSource.instagram:
        return this.instagramPostService.getPosts(fromDate);
      default:
        throw new ApiError(
          `Fetching posts from ${source} is not implemented`,
          StatusCodes.NOT_IMPLEMENTED
        );
    }
  }

  private async doesPostExist(url: string): Promise<boolean> {
    const postList = await this.postRepository.find({ url, limit: 1 });

    const doesPostExist = postList.items.length > 0;

    return doesPostExist;
  }
}

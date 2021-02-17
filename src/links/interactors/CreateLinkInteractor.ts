import { StatusCodes } from 'http-status-codes';

import { Link } from '../models/Link';
import { Interactor } from '../../common/modules/Interactor';
import { PostRepository } from '../../posts/repositories/PostRepository';
import { MongoDBPostRepository } from '../../posts/repositories/MongoDBPostRepository';
import { LinkRepository } from '../repositories/LinkRepository';
import { MongoDBLinkRepository } from '../repositories/MongoDBLinkRepository';
import { Post } from '../../posts/models/Post';
import { ApiError } from '../../common/models/ApiError';
import { LinkCreationDTO } from '../models/LinkCreationDTO';
import { FileService } from '../../common/services/FileService';
import { AwsS3FileService } from '../../common/services/AwsS3FileService';
import { nanoid } from 'nanoid';

export type CreateLinkInput = {
  sourcePostId: string;
  destinationPostId: string;
};
export type CreateLinkOutput = Link;

export class CreateLinkInteractor
  implements Interactor<CreateLinkInput, CreateLinkOutput> {
  constructor(
    private readonly postRepository: PostRepository = new MongoDBPostRepository(),
    private readonly linkRepository: LinkRepository = new MongoDBLinkRepository(),
    private readonly fileService: FileService = new AwsS3FileService()
  ) {}

  public async interact(input: CreateLinkInput): Promise<CreateLinkOutput> {
    const { sourcePostId, destinationPostId } = input;

    if (await this.doLinksFromSourceExist(sourcePostId)) {
      throw new ApiError(
        'Links already exist for the given source post',
        StatusCodes.BAD_REQUEST
      );
    }

    const [sourcePost, destinationPost] = await Promise.all([
      this.findPost(sourcePostId),
      this.findPost(destinationPostId),
    ]);

    const { publishedAt } = sourcePost;
    const { title, url: destinationUrl } = destinationPost;

    const pictureUrl = await this.uploadImage(sourcePost.pictureUrl);

    const linkCreationDTO: LinkCreationDTO = {
      sourcePostId,
      publishedAt,
      title,
      destinationUrl,
      pictureUrl,
    };

    const link = await this.linkRepository.create(linkCreationDTO);

    return link;
  }

  private async findPost(postId: string): Promise<Post> {
    const post = await this.postRepository.findOne({ id: postId });

    return post;
  }

  private async doLinksFromSourceExist(sourcePostId: string): Promise<boolean> {
    let doLinksFromSourceExist: boolean;

    try {
      await this.linkRepository.findOne({ sourcePostId });

      doLinksFromSourceExist = true;
    } catch (err) {
      doLinksFromSourceExist = false;
    }

    return doLinksFromSourceExist;
  }

  private async uploadImage(sourceUrl: string): Promise<string> {
    const destinationFilepath = nanoid();

    const { uploadedFileUrl } = await this.fileService.uploadFile({
      sourceUrl: sourceUrl,
      destinationFilepath,
    });

    return uploadedFileUrl;
  }
}

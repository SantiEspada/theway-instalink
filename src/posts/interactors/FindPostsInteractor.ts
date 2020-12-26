import { List } from '../../common/models/List';
import { Post, PostSource } from '../models/Post';
import { Interactor } from '../../common/modules/Interactor';
import { PostRepository } from '../repositories/PostRepository';
import { MongoDBPostRepository } from '../repositories/MongoDBPostRepository';

export type FindPostsInput = {
  source: PostSource;
};
export type FindPostsOutput = List<Post>;

export class FindPostsInteractor
  implements Interactor<FindPostsInput, FindPostsOutput> {
  constructor(
    private readonly postRepository: PostRepository = new MongoDBPostRepository()
  ) {}

  public async interact(input: FindPostsInput): Promise<FindPostsOutput> {
    const { source } = input;

    const postList = await this.postRepository.find({ source });

    return postList;
  }
}

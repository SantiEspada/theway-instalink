import { Post } from '../models/Post';
import { PostCreationDTO } from '../models/PostCreationDTO';
import { PostFindDTO } from '../models/PostFindDTO';
import { PostDeletionDTO } from '../models/PostDeletionDTO';
import { List } from '../../common/models/List';
import { PostUpdateDTO } from '../models/PostUpdateDTO';

export interface PostRepository {
  create(creationDTO: PostCreationDTO): Promise<Post>;
  find(findDTO: PostFindDTO): Promise<List<Post>>;
  findOne(findDTO: PostFindDTO): Promise<Post>;
  delete(deletionDTO: PostDeletionDTO): Promise<void>;
  findAndUpdateOne(
    findDTO: PostFindDTO,
    updateDTO: PostUpdateDTO
  ): Promise<Post>;
}

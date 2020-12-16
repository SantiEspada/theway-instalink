import { Entity } from '../../common/models/Entity';

export enum PostSource {
  instagram = 'instagram',
  blog = 'blog',
}

export interface Post extends Entity {
  source: PostSource;
  title: string;
  url: string;
  pictureUrl: string;
}

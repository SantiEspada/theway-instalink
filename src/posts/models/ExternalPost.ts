import { Post } from './Post';

export type ExternalPost = Pick<
  Post,
  'title' | 'url' | 'pictureUrl' | 'publishedAt'
>;

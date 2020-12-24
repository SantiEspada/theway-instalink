import { PostSource } from './Post';

export interface PostFindDTO {
  id?: string;
  source?: PostSource;
  url?: string;
  limit?: number;
  publishedAt?: Date;
}

import { PostSource } from './Post';

export interface PostCreationDTO {
  source: PostSource;
  title: string;
  url: string;
  pictureUrl: string;
  publishedAt: Date;
}

import { Entity } from '../../common/models/Entity';

export interface Link extends Entity {
  sourcePostId: string;
  publishedAt: Date;
  title: string;
  destinationUrl: string;
  pictureUrl: string;
  stats: {
    clicks: number;
  };
}

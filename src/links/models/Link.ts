import { Entity } from '../../common/models/Entity';

export interface Link extends Entity {
  title: string;
  destinationUrl: string;
  pictureUrl: string;
  stats: {
    clicks: number;
  };
}

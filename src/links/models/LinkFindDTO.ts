import { SortDirection } from '../../common/models/SortDirection';
import { Link } from './Link';

export interface LinkFindDTO {
  id?: string;
  sourcePostId?: string;
  limit?: number;
  sort?: {
    by: keyof Link;
    direction: SortDirection;
  };
}

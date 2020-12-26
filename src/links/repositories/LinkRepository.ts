import { Link } from '../models/Link';
import { LinkCreationDTO } from '../models/LinkCreationDTO';
import { LinkFindDTO } from '../models/LinkFindDTO';
import { LinkDeletionDTO } from '../models/LinkDeletionDTO';
import { List } from '../../common/models/List';

export interface LinkRepository {
  create(creationDTO: LinkCreationDTO): Promise<Link>;
  find(findDTO: LinkFindDTO): Promise<List<Link>>;
  findOne(findDTO: LinkFindDTO): Promise<Link>;
  delete(deletionDTO: LinkDeletionDTO): Promise<void>;
}

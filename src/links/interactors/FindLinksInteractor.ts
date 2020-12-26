import { LinkFindDTO } from '../models/LinkFindDTO';
import { List } from '../../common/models/List';
import { Link } from '../models/Link';
import { Interactor } from '../../common/modules/Interactor';
import { LinkRepository } from '../repositories/LinkRepository';
import { MongoDBLinkRepository } from '../repositories/MongoDBLinkRepository';

export type FindLinksInput = Pick<LinkFindDTO, 'sort'>;
export type FindLinksOutput = List<Link>;

export class FindLinksInteractor
  implements Interactor<FindLinksInput, FindLinksOutput> {
  constructor(
    private readonly linkRepository: LinkRepository = new MongoDBLinkRepository()
  ) {}

  public async interact(input: FindLinksInput): Promise<FindLinksOutput> {
    const { sort } = input;

    const linkList = await this.linkRepository.find({ sort });

    return linkList;
  }
}

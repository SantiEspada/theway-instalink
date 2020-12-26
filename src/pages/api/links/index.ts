import { NextApiRequestHandler } from '../../../common/modules/NextApiRequestHandler';
import { LinkRequestHandler } from '../../../links/request-handlers/LinksRequestHandler';

const linkRequestHandler = new LinkRequestHandler();

const nextRequestHandler = new NextApiRequestHandler(linkRequestHandler);

export default nextRequestHandler.handler;

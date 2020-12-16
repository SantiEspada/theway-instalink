import { NextApiRequestHandler } from '../../../common/modules/NextApiRequestHandler';
import { PostsSyncRequestHandler } from '../../../posts/request-handlers/PostsSyncRequestHandler';

const postsSyncRequestHandler = new PostsSyncRequestHandler();

const nextRequestHandler = new NextApiRequestHandler(postsSyncRequestHandler);

export default nextRequestHandler.handler;

import { NextApiRequestHandler } from '../../../common/modules/NextApiRequestHandler';
import { PostsRequestHandler } from '../../../posts/request-handlers/PostsRequestHandler';

const postsRequestHandler = new PostsRequestHandler();

const nextRequestHandler = new NextApiRequestHandler(postsRequestHandler);

export default nextRequestHandler.handler;

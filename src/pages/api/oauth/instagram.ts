import { InstagramOauthRequestHandler } from '../../../app-config/request-handlers/InstagramOauthRequestHandler';
import { NextApiRequestHandler } from '../../../common/modules/NextApiRequestHandler';

const postInstagramOauthRequestHandler = new InstagramOauthRequestHandler();

const nextRequestHandler = new NextApiRequestHandler(
  postInstagramOauthRequestHandler
);

export default nextRequestHandler.handler;

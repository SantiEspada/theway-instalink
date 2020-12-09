import { AuthSessionsRequestHandler } from '../../../../auth/request-handlers/AuthSessionsRequestHandler';
import { NextApiRequestHandler } from '../../../../common/modules/NextApiRequestHandler';

const postAuthSessionsRequestHandler = new AuthSessionsRequestHandler();

const nextRequestHandler = new NextApiRequestHandler(
  postAuthSessionsRequestHandler
);

export default nextRequestHandler.handler;

import { AuthSessionsSessionIdVerifyRequestHandler } from '../../../../../auth/request-handlers/AuthSessionsSessionIdVerifyRequestHandler';
import { NextApiRequestHandler } from '../../../../../common/modules/NextApiRequestHandler';

const authSessionsSessionIdVerifyRequestHandler = new AuthSessionsSessionIdVerifyRequestHandler();

const nextRequestHandler = new NextApiRequestHandler(
  authSessionsSessionIdVerifyRequestHandler
);

export default nextRequestHandler.handler;

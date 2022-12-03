import { AppConfigsRequestHandler } from '../../app-config/request-handlers/AppConfigRequestHandler';
import { NextApiRequestHandler } from '../../common/modules/NextApiRequestHandler';

const appconfigsRequestHandler = new AppConfigsRequestHandler();

const nextRequestHandler = new NextApiRequestHandler(appconfigsRequestHandler);

export default nextRequestHandler.handler;

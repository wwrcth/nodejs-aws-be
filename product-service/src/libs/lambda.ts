import middy from '@middy/core';
import middyJsonBodyParser from '@middy/http-json-body-parser';
import inputOutputLogger from '@middy/input-output-logger';
import errorLogger from '@middy/error-logger';

import { dbConnectionManageService } from '@services/db-connection-manage.service';

export const middyfy = ({ handler, dbConnectService }) => {
  return middy(handler)
    .use(middyJsonBodyParser())
    .use(inputOutputLogger())
    .use(errorLogger())
    .use(dbConnectionManageService(dbConnectService));
}

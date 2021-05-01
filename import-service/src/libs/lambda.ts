import middy from '@middy/core';
import middyJsonBodyParser from '@middy/http-json-body-parser';
import inputOutputLogger from '@middy/input-output-logger';
import errorLogger from '@middy/error-logger';
import httpCors from '@middy/http-cors';

export const middyfy = (handler) => {
  return middy(handler)
    .use(middyJsonBodyParser())
    .use(httpCors())
    .use(inputOutputLogger())
    .use(errorLogger());
}

import 'source-map-support/register';
import AWS from 'aws-sdk';

import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse, formatJSONError } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';

const importProductsFile: ValidatedEventAPIGatewayProxyEvent<any> = async (event) => {
  try {
    const { name } = event.queryStringParameters;

    if (name) {
      console.log('inside if');
      const s3 = new AWS.S3({ region: 'eu-west-1' });
      const params = {
        Bucket: 'aws-products-file-import',
        Key: `uploaded/${name}`,
        Expires: 60,
        ContentType: 'text/csv'
      };
      const result = await s3.getSignedUrl('putObject', params);
      console.log('result', result);
      return formatJSONResponse(result);
    } else {
      return formatJSONError({ message: 'Please pass file name as a query parameter' }, 400);
    }
  } catch (err) {
    return formatJSONError({ message: err });
  }
}

export const main = middyfy(importProductsFile);

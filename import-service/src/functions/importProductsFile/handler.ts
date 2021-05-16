import 'source-map-support/register';

import { formatJSONResponse, formatJSONError } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import { S3ManagementService } from '@services/s3-management.service';

const importProductsFile = (s3ManagementService: S3ManagementService) => async (event) => {
  try {
    const { name } = event.queryStringParameters;

    if (name) {
      const result = await s3ManagementService.getSignedUrl(name);

      return formatJSONResponse(result);
    } else {
      return formatJSONError('Please pass file name as a query parameter', 400);
    }
  } catch (err) {
    return formatJSONError(`Error during importProductsFile execution: ${err}`);
  }
}

const s3ManagementService = new S3ManagementService();

export const main = middyfy(importProductsFile(s3ManagementService));

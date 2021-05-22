import 'source-map-support/register';
import { S3Event } from 'aws-lambda';

import { formatJSONResponse, formatJSONError } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';

import { SqsManagementService } from '@services/sqs-management.service';
import { S3ManagementService } from '@services/s3-management.service';

const importFileParser = (s3ManagementService: S3ManagementService) => async (event: S3Event) => {
  try {
    const [record] = event.Records;

    await s3ManagementService.parseFileData(record.s3);
    return formatJSONResponse();
  } catch (err) {
    return formatJSONError(`Error during importFileParser execution: ${err}`);
  }
}

const sqsManagementService = new SqsManagementService();
const s3ManagementService = new S3ManagementService(sqsManagementService);

export const main = middyfy(importFileParser(s3ManagementService));

import 'source-map-support/register';
import csv from 'csv-parser';
import AWS from 'aws-sdk';
import {S3Event} from 'aws-lambda';

import { formatJSONResponse, formatJSONError } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';

// S3Handler
const importFileParser: any = async (event: S3Event) => {
  try {
    console.log('invoke importFileParser');
    const [record] = event.Records;
    console.log('record', record);
    const s3 = new AWS.S3({ region: 'eu-west-1' });
    const params = {
      Bucket: record.s3.bucket.name,
      Key: record.s3.object.key,
    };
    const s3Stream = s3.getObject(params).createReadStream();
    await new Promise((resolve, reject) => {
      s3Stream
        .pipe(csv())
        .on('data', (data) => {console.log(data); console.log(`Parsed data: ${JSON.stringify(data)}`)})
        .on('error', (err) => { throw new Error(`Error during parsing file's data: ${err}`); reject(); })
        .on('end', async () => {
          console.log('copy start');
          const copyParams = {
            Bucket: record.s3.bucket.name,
            CopySource: `${record.s3.bucket.name}/${record.s3.object.key}`,
            Key: record.s3.object.key.replace('uploaded', 'parsed'),
          };
          await s3.copyObject(copyParams).promise();
          console.log('copy end');

          console.log('delete start');
          const deleteParams = {
            Bucket: record.s3.bucket.name,
            Key: record.s3.object.key
          };
          await s3.deleteObject(deleteParams).promise();
          console.log('delete end');

          resolve('Success');
        });
    });
    console.log('line before return');
    return formatJSONResponse();
  } catch (err) {
    return formatJSONError({ message: err });
  }
}

export const main = middyfy(importFileParser);

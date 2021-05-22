import 'source-map-support/register';
import AWS from 'aws-sdk';

// import { formatJSONResponse, formatJSONError } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { DbConnectService } from '@services/db-connect.service';
import {SQSHandler} from "aws-lambda";
// import { ProductService } from '@services/product.service';

const catalogBatchProcess: SQSHandler = async (event) => {
  try {
    console.log('catalogBatchProcess');
    console.log(event);
    const sns = new AWS.SNS({ region: 'eu-west-1' });
    for (const record of event.Records) {
      const product = JSON.parse(record.body);
      console.log('Message Body -->  ', product);
      await sns.publish({
        Subject: 'Import Products CSV info',
        Message: record.body,
        MessageAttributes: {
          price: {
            DataType: 'Number',
            StringValue: product.price
          }
        },
        TopicArn: process.env.SNS_ARN,
      }).promise();

      // Do something
    }

    // return formatJSONResponse({ test: 'success message!' });
  } catch (err) {
    // return formatJSONError({ message: err });
  }
}

const dbConnectService = new DbConnectService();
// const productService = new ProductService(dbConnectService);

export const main = middyfy({ handler: catalogBatchProcess, dbConnectService });

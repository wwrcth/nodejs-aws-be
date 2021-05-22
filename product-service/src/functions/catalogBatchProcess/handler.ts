import 'source-map-support/register';

import { middyfy } from '@libs/lambda';
import { DbConnectService } from '@services/db-connect.service';
import { SnsManagementService } from '@services/sns-management.service';
// import {ProductService} from "@services/product.service";
// import { ProductService } from '@services/product.service';

const catalogBatchProcess = (snsManagementService: SnsManagementService) => async (event) => {
  for (const { body } of event.Records) {
    const { price } = JSON.parse(body);

    console.log(`Message body: ${body}`);
    await snsManagementService.publish(body, price);
    console.log('Publishing to SNS is finished');
  }
}

const dbConnectService = new DbConnectService();
const snsManagementService = new SnsManagementService();
// const productService = new ProductService(dbConnectService);

export const main = middyfy({ handler: catalogBatchProcess(snsManagementService), dbConnectService });

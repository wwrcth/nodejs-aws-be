import 'source-map-support/register';

import { middyfy } from '@libs/lambda';
import { formatJSONError, formatJSONResponse } from '@libs/api-gateway';

import { DbConnectService } from '@services/db-connect.service';
import { SnsManagementService } from '@services/sns-management.service';
import { ProductService } from '@services/product.service';

const catalogBatchProcess = (productService: ProductService, snsManagementService: SnsManagementService) => async (event) => {
  try {
    for (const { body } of event.Records) {
      const product = JSON.parse(body);
      console.log(`Message body: ${body}`);

      if (!productService.isProductValid(product)) {
        return formatJSONError({ message: 'Please pass correct product structure' }, 400);
      }

      const createdProduct = await productService.createProduct(product);
      console.log(`Product is stored in db: ${JSON.stringify(createdProduct)}`);

      await snsManagementService.publish(body, product.price);
      console.log('Publishing to SNS is finished');
    }

    return formatJSONResponse();
  } catch (err) {
    return formatJSONError({ message: err });
  }
}

const dbConnectService = new DbConnectService();
const snsManagementService = new SnsManagementService();
const productService = new ProductService(dbConnectService);

export const main = middyfy({ handler: catalogBatchProcess(productService, snsManagementService), dbConnectService });

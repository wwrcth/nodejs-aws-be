import 'source-map-support/register';

import { formatJSONResponse, formatJSONError } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { DbConnectService } from '@services/db-connect.service';
import { ProductService } from '@services/product.service';

const createProduct = (productService: ProductService) => async (event) => {
  try {
    const newProduct = event.body;

    if (!productService.isProductValid(newProduct)) {
      return formatJSONError({ message: 'Please pass correct product structure' }, 400);
    }

    const createdProduct = await productService.createProduct(newProduct);

    return formatJSONResponse(createdProduct, 201);
  } catch (err) {
    return formatJSONError({ message: err });
  }
}

const dbConnectService = new DbConnectService();
const productService = new ProductService(dbConnectService);

export const main = middyfy({ handler: createProduct(productService), dbConnectService });

import 'source-map-support/register';

import { formatJSONResponse, formatJSONError } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { DbConnectService } from '@services/db-connect.service';
import { ProductService } from '@services/product.service';

const getProductsList = (productService: ProductService) => async () => {
  try {
    const productList = await productService.getAllProducts();

    return formatJSONResponse(productList);
  } catch (err) {
    return formatJSONError({ message: err });
  }
}

const dbConnectService = new DbConnectService();
const productService = new ProductService(dbConnectService);

export const main = middyfy({ handler: getProductsList(productService), dbConnectService });

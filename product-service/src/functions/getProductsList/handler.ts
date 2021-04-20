import 'source-map-support/register';

import { formatJSONResponse, formatJSONError } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { GetProductsListService } from '@services/get-products-list.service';
import { DbConnectService } from '@services/db-connect.service';

const getProductsList = (getProductsListService: GetProductsListService) => async () => {
  try {
    const productList = await getProductsListService.getAllProducts();

    return formatJSONResponse(productList);
  } catch (err) {
    return formatJSONError({ message: err });
  }
}

const dbConnectService = new DbConnectService();
const getProductsListService = new GetProductsListService(dbConnectService);

export const main = middyfy({ handler: getProductsList(getProductsListService), dbConnectService });



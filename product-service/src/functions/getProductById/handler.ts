import 'source-map-support/register';

import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';

import { productsList } from '../../mocks/products-list';
import { ProductModel } from '../../models/products-list';

const getProductById: ValidatedEventAPIGatewayProxyEvent<any> = async (event) => {
  try {
    const product = productsList.find((el: ProductModel) => el.id === event.pathParameters.productId);

    return product ? formatJSONResponse(product) : formatJSONResponse({ message: 'Product not found' }, 404);
  } catch (err) {
    return formatJSONResponse({ message: err }, 500);
  }
}

export const main = middyfy(getProductById);

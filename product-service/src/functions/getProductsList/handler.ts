import 'source-map-support/register';

import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';

import { productsList } from '../../mocks/products-list';

const getProductsList: ValidatedEventAPIGatewayProxyEvent<any> = async () => {
  try {
    return formatJSONResponse(productsList);
  } catch (err) {
    return formatJSONResponse({ message: err }, 500);
  }
}

export const main = middyfy(getProductsList);

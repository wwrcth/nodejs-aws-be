import 'source-map-support/register';

import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';

import { productsList } from '../../mocks/products-list';

const getProductsList: ValidatedEventAPIGatewayProxyEvent<any> = async () => {
  return formatJSONResponse(productsList);
}

export const main = middyfy(getProductsList);

import 'source-map-support/register';
import Joi from 'joi';

import { formatJSONResponse, formatJSONError } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { GetProductByIdService } from '@services/get-product-by-id.service';
import { DbConnectService } from '@services/db-connect.service';

const getProductById = (getProductByIdService: GetProductByIdService) => async (event) => {
  try {
    const productIdValidationScheme = Joi.string().uuid().required();
    const { productId } = event.pathParameters;
    const { error } = productIdValidationScheme.validate(productId);

    if (error) {
      return formatJSONError({ message: 'Please pass product id in uuid format' }, 400);
    }

    const product = await getProductByIdService.getProductById(productId);

    return product ? formatJSONResponse(product) : formatJSONError({ message: 'Product not found' }, 404);
  } catch (err) {
    return formatJSONError({ message: err });
  }
}

const dbConnectService = new DbConnectService();
const getProductByIdService = new GetProductByIdService(dbConnectService);

export const main = middyfy({ handler: getProductById(getProductByIdService), dbConnectService });


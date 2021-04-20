import 'source-map-support/register';
import Joi from 'joi';

import { formatJSONResponse, formatJSONError } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { DbConnectService } from '@services/db-connect.service';
import { ProductService } from '@services/product.service';

const getProductById = (productService: ProductService) => async (event) => {
  try {
    const productIdValidationScheme = Joi.string().uuid().required();
    const { productId } = event.pathParameters;
    const { error } = productIdValidationScheme.validate(productId);

    if (error) {
      return formatJSONError({ message: 'Please pass product id in uuid format' }, 400);
    }

    const product = await productService.getProductById(productId);

    return product ? formatJSONResponse(product) : formatJSONError({ message: 'Product not found' }, 404);
  } catch (err) {
    return formatJSONError({ message: err });
  }
}

const dbConnectService = new DbConnectService();
const productService = new ProductService(dbConnectService);

export const main = middyfy({ handler: getProductById(productService), dbConnectService });

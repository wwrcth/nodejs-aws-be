import 'source-map-support/register';
import Joi from 'joi';

import { formatJSONResponse, formatJSONError } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { DbConnectService } from '@services/db-connect.service';
import { ProductService } from '@services/product.service';

const createProduct = (productService: ProductService) => async (event) => {
  try {
    const newProduct = event.body;
    const newProductValidationScheme = Joi.object({
      title: Joi.string().required(),
      description: Joi.string(),
      price: Joi.number().integer().min(1).max(250),
      count: Joi.number().integer().min(1).max(250),
    });
    const { error } = newProductValidationScheme.validate(newProduct);

    if (error) {
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

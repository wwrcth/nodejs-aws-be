import 'source-map-support/register';
import Joi from 'joi';

import { formatJSONResponse, formatJSONError } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { CreateProductService } from '@services/create-product.service';
import { DbConnectService } from '@services/db-connect.service';

const createProduct = (createProductService: CreateProductService) => async (event) => {
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

    const createdProduct = await createProductService.createProduct(newProduct);

    return formatJSONResponse(createdProduct, 201);
  } catch (err) {
    return formatJSONError({ message: err });
  }
}

const dbConnectService = new DbConnectService();
const createProductService = new CreateProductService(dbConnectService);

export const main = middyfy({ handler: createProduct(createProductService), dbConnectService });

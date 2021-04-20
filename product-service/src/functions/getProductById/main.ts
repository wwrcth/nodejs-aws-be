import { middyfy } from '@libs/lambda';
import { GetProductByIdHandler } from '@functions/getProductById/handler';
import { DbConnectService } from '@services/db-connect.service';
import { GetProductByIdService } from '@services/get-product-by-id.service';

const dbConnectService = new DbConnectService();
const getProductByIdService = new GetProductByIdService(dbConnectService);
const getProductsListHandler = new GetProductByIdHandler(getProductByIdService);

export const main = middyfy({ handler: getProductsListHandler.handle, dbConnectService });

import { middyfy } from'@libs/lambda';
import { GetProductsListHandler } from '@functions/getProductsList/handler';
import { DbConnectService } from '@services/db-connect.service';
import { GetProductsListService } from '@services/get-products-list.service';

const dbConnectService = new DbConnectService();
const getProductsListService = new GetProductsListService(dbConnectService);
const getProductsListHandler = new GetProductsListHandler(getProductsListService);

export const main = middyfy({ handler: getProductsListHandler.handle, dbConnectService });

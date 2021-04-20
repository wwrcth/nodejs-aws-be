import 'source-map-support/register';

import {
  formatJSONResponse,
  formatJSONError,
  ValidatedEventAPIGatewayProxyEvent,
} from '@libs/api-gateway';
import { GetProductsListService } from '@services/get-products-list.service';

export class GetProductsListHandler {
  constructor(
    private getProductsListService: GetProductsListService,
  ) {}

  handle: ValidatedEventAPIGatewayProxyEvent<any> = async() => {
    try {
      const productList = await this.getProductsListService.getAllProducts();

      return formatJSONResponse(productList);
    } catch (err) {
      return formatJSONError({ message: err });
    }
  }
}

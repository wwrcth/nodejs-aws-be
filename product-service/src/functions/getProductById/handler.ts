import 'source-map-support/register';

import {
  formatJSONResponse,
  formatJSONError,
  ValidatedEventAPIGatewayProxyEvent,
} from '@libs/api-gateway';
import { GetProductByIdService } from '@services/get-product-by-id.service';

export class GetProductByIdHandler {
  constructor(
    private getProductByIdService: GetProductByIdService,
  ) {}

  handle: ValidatedEventAPIGatewayProxyEvent<any> = async(event) => {
    try {
      const { productId } = event.pathParameters;
      const product = await this.getProductByIdService.getProductById(productId);

      return product ? formatJSONResponse(product) : formatJSONError({ message: 'Product not found' }, 404);
    } catch (err) {
      return formatJSONError({ message: err });
    }
  }
}

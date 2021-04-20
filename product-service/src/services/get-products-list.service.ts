import { DbConnectService } from '@services/db-connect.service';

export class GetProductsListService {
  constructor(
    private dbConnectService: DbConnectService,
  ) {}

  async getAllProducts() {
    const { rows } = await this.dbConnectService.runQuery(
      'select id, title, description, price, count from product p left join stock s on p.id = s.product_id'
    );

    return rows;
  }
}

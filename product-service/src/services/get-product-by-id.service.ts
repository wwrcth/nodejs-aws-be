import { DbConnectService } from '@services/db-connect.service';

export class GetProductByIdService {
  constructor(
    private dbConnectService: DbConnectService,
  ) {}

  async getProductById(id: string) {
    const { rows } = await this.dbConnectService.runQuery(
      'select id, title, description, price, count from product p left join stock s on p.id = s.product_id where p.id = $1',
      [id]
    );

    return rows[0];
  }
}

import { DbConnectService } from '@services/db-connect.service';

export class ProductService {
  constructor(
    private dbConnectService: DbConnectService,
  ) {}

  async getAllProducts() {
    const { rows } = await this.dbConnectService.runQuery(
      'select id, title, description, price, count from product p left join stock s on p.id = s.product_id'
    );

    return rows;
  }

  async getProductById(id: string) {
    const { rows } = await this.dbConnectService.runQuery(
      'select id, title, description, price, count from product p left join stock s on p.id = s.product_id where p.id = $1',
      [id]
    );

    return rows[0];
  }

  async createProduct({ title, description, price, count }) {
    try {
      await this.dbConnectService.runQuery('BEGIN')

      const { rows } = await this.dbConnectService.runQuery(
        'INSERT INTO product(title, description, price) VALUES($1, $2, $3) RETURNING id',
        [title, description, price]
      );

      const { id } = rows[0];
      await this.dbConnectService.runQuery(
        'INSERT INTO stock(product_id, count) VALUES ($1, $2)',
        [id, count]
      );

      await this.dbConnectService.runQuery('COMMIT');

      return await this.getProductById(id);
    } catch (err) {
      await this.dbConnectService.runQuery('ROLLBACK');
      throw (new Error(`Error during product creation in db: ${err}`));
    }
  }
}

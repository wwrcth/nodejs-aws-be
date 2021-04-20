import {Client, ClientConfig, QueryResult} from 'pg';

const { PG_HOST, PG_PORT, PG_DATABASE, PG_USERNAME, PG_PASSWORD }: any = process.env;

export class DbConnectService {
  private client: Client;

  async connect(): Promise<void> {
    const dbConfig: ClientConfig = {
      host: PG_HOST,
      port: PG_PORT,
      database: PG_DATABASE,
      user: PG_USERNAME,
      password: PG_PASSWORD,
      ssl: {
        rejectUnauthorized: false
      },
      connectionTimeoutMillis: 5000
    };

    this.client = new Client(dbConfig);
    await this.client.connect();
  }

  async end(): Promise<void> {
    await this.client.end();
  }

  async runQuery(query: string, values?: any): Promise<QueryResult> {
    return await this.client.query(query, values);
  }
}

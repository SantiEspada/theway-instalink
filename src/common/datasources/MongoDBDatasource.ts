import * as MongoDb from 'mongodb';

export class MongoDBDatasource {
  private cachedClient: MongoDb.MongoClient;

  private readonly config;

  constructor(env = process.env) {
    this.config = {
      db: process.env.DATABASE_NAME,
      connectionUri: process.env.DATABASE_CONNECTION_URL,
    };
  }

  public async createClient(): Promise<MongoDb.MongoClient> {
    const global = globalThis as any;

    if (global.mongoDbClient instanceof MongoDb.MongoClient) {
      return global.mongoDbClient as MongoDb.MongoClient;
    } else {
      const client = await new MongoDb.MongoClient(this.config.connectionUri, {
        useNewUrlParser: true,
      }).connect();

      global.mongoDbClient = client;

      return client;
    }
  }

  public async getClient(): Promise<MongoDb.Db> {
    if (!this.cachedClient) {
      this.cachedClient = await this.createClient();
    }

    return this.cachedClient.db(this.config.db);
  }
}

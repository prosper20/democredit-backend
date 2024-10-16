import { createClient } from "redis";

export abstract class AbstractRedisClient {
  private tokenExpiryTime: number = 604800; // 7 days
  protected client: ReturnType<typeof createClient>;

  constructor(client: ReturnType<typeof createClient>) {
    this.client = client;
  }

  public async count(key: string): Promise<number> {
    const allKeys = await this.getAllKeys(key);
    return allKeys.length;
  }

  public exists(key: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      return this.count(key)
        .then((count) => {
          return resolve(count >= 1 ? true : false);
        })
        .catch((err) => {
          return reject(err);
        });
    });
  }

  public getOne<T>(key: string): Promise<T> {
    return this.client.get(key).then((reply) => reply)
    .catch((error) => error);
  }

  public getAllKeys(wildcard: string): Promise<string[]> {
    return this.client.keys(wildcard).then((results: string[]) => results)
      .catch((error) => error);
  }
  

  public getAllKeyValue(wildcard: string): Promise<any[]> {
    return this.client.keys(wildcard) .then((results: string[]) => {
      const allResults =
        results.map(async (key) => {
          const value = await this.getOne(key);
          return { key, value };
        });
      return allResults;
    })
    .catch((error) => error);
  }

  public set(key: string, value: any): Promise<any> {
    return this.client.set(key, value).then((reply) => reply)
    .catch((error) => error);
  }

  public deleteOne(key: string): Promise<number> {
    return this.client.del(key).then((reply) => reply)
    .catch((error) => error);
  }

  public testConnection(): Promise<any> {
    return this.client.set("test", "connected").then((reply) => reply)
      .catch((error) => error);
  }
}


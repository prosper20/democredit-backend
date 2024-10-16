import { createClient } from "redis";

export class RedisStore {
  private redisConnection: ReturnType<typeof createClient>;

  constructor(redisConnection: ReturnType<typeof createClient>) {
    this.redisConnection = redisConnection;
  }
  async testConnection(): Promise<boolean> {
    try {
      await this.redisConnection.set("testKey", "testValue");
      return true;
    } catch (error) {
      console.log (error)
      return false;
    }
  }
}

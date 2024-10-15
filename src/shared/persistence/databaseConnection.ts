import db from './knex';

export class Database {
  async testConnection(): Promise<boolean> {
    try {
      // Perform a simple query to test the database connection
      const users = await db('users').select('*');
      console.log("Connected to the database successfully.");
      console.log("Users:", users);
      return true;
    } catch (error) {
      console.error("Failed to connect to the database:", error);
      return false;
    }
  }
}

import { Knex } from 'knex';

import { IUserRepo } from "../userRepo";
import { User } from "../../domain/user";
import { UserMap } from "../../mappers/userMap";
import { UserEmail } from "../../domain/userEmail";


export class KnexUserRepo implements IUserRepo {
  private db: Knex<any, unknown[]>; 

  constructor (db: Knex<any, unknown[]>) {
    this.db = db;
  }

  async exists(userEmail: UserEmail): Promise<boolean> {
    const result = await this.db('users').where({ email: userEmail.value }).first();
    return !!result;
  }

  async getUserByEmail(email: string): Promise<User> {
    const user = await this.db('users').where({ email }).first();
    
    if (!user) throw new Error("User not found.");
    return UserMap.toDomain(user);
  }

  async getUserByUserId(userId: string): Promise<User> {
    const user = await this.db('users').where({ id: userId }).first();
    
    if (!user) throw new Error("User not found.");
    return UserMap.toDomain(user);
  }

  async save(user: User): Promise<void> {
    const exists = await this.exists(user.email);
    const rawKnexUser = await UserMap.toPersistence(user);
    
    if (exists) {
    await this.db('users')
      .where({ email: user.email.value })
      .update(rawKnexUser);
    } else {
      await this.db('users').insert(rawKnexUser);
    }

  }
}

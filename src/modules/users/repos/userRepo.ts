
import { User } from "../domain/user";
import { UserEmail } from "../domain/userEmail";

export interface IUserRepo {
  exists (userEmail: UserEmail): Promise<boolean>;
  getUserByEmail (email: string): Promise<User>;
  getUserByUserId (userId: string): Promise<User>;
  save (user: User): Promise<void>;
}
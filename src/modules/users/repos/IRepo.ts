
import { Transaction } from "../domain/transaction";
import { User } from "../domain/user";
import { UserEmail } from "../domain/userEmail";
import { Wallet } from "../domain/wallet";

export interface IUserRepo {
  exists (userEmail: UserEmail): Promise<boolean>;
  getUserByEmail (email: string): Promise<User>;
  getUserByUserId (userId: string): Promise<User>;
  save (user: User): Promise<void>;
}

export interface IWalletRepo {
  createWallet(wallet: Wallet): Promise<void>
}

export interface ITransactionRepo {
  createTransaction(transaction: Transaction): Promise<void>
  getTransactionsForUser(userId: string, page: number, limit: number): Promise<{ transactions: Transaction[], total: number }>
}
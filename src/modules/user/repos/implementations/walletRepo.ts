import { Knex } from 'knex';
import { Wallet } from '../../domain/wallet';
import { WalletMap } from '../../mappers/walletMap';
import { IWalletRepo } from '../IRepo';

export class KnexWalletRepo implements IWalletRepo {
  private db: Knex<any, unknown[]>;

  constructor(db: Knex<any, unknown[]>) {
    this.db = db;
  }

  async createWallet(wallet: Wallet): Promise<void> {
    const rawWallet = await WalletMap.toPersistence(wallet);
    await this.db('wallets').insert(rawWallet);
  }

  async getWallet(userId: string): Promise<Wallet> {
    const wallet = await this.db('wallets').where({ user_id: userId }).first();
    
    if (!wallet) throw new Error("Wallet not found.");

    return WalletMap.toDomain(wallet);
  }
}

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
}

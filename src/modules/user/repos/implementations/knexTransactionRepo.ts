import { Knex } from 'knex';

import { Transaction } from '../../domain/transaction';
import { TransactionMap } from '../../mappers/transactionMap';
import { ITransactionRepo } from '../IRepo';
import { dispatchEventsCallback } from '../../../../shared/domain/events/DispatchEvents';

export class KnexTransactionRepo implements ITransactionRepo {
  private db: Knex<any, unknown[]>;

  constructor(db: Knex<any, unknown[]>) {
    this.db = db;
  }

  async createTransaction(transaction: Transaction): Promise<void> {
    const type = transaction.type as string;
    const amount = transaction.amount;
    const senderId = transaction.senderId?.toString();
    const receiverId = transaction.receiverId.toString();

    await this.db.transaction(async (trx) => {
      switch (type) {
        case 'DEPOSIT':
          const receiverWalletDeposit = await trx('wallets').where({ user_id: receiverId }).first();
          if (!receiverWalletDeposit) throw new Error("Receiver wallet not found.");

          const newReceiverBalanceDeposit = parseFloat(receiverWalletDeposit.balance) + amount;

          await trx('wallets')
            .where({ user_id: receiverId })
            .update({ balance: newReceiverBalanceDeposit });

          break;

        case 'WITHDRAWAL':
          const senderWalletWithdrawal = await trx('wallets').where({ user_id: senderId }).first();
          if (!senderWalletWithdrawal) throw new Error("Sender wallet not found.");

          const newSenderBalanceWithdrawal = parseFloat(senderWalletWithdrawal.balance) - amount;
          if (newSenderBalanceWithdrawal < 0) throw new Error("Insufficient funds.");

          await trx('wallets')
            .where({ user_id: senderId })
            .update({ balance: newSenderBalanceWithdrawal });

          break;

        case 'DISBURSEMENT':
        case 'REPAYMENT':
        case 'TRANSFER':
          const senderWallet = await trx('wallets').where({ user_id: senderId }).first();
          if (!senderWallet) throw new Error("Sender wallet not found.");

          const newSenderBalance = parseFloat(senderWallet.balance) - amount;
          if (newSenderBalance < 0) throw new Error("Insufficient funds.");

          await trx('wallets')
            .where({ user_id: senderId })
            .update({ balance: newSenderBalance });

          const receiverWallet = await trx('wallets').where({ user_id: receiverId }).first();
          if (!receiverWallet) throw new Error("Receiver wallet not found.");

          const newReceiverBalance = parseFloat(receiverWallet.balance) + amount;

          await trx('wallets')
            .where({ user_id: receiverId })
            .update({ balance: newReceiverBalance });

          break;

        default:
          throw new Error("Invalid transaction type.");
      }

      const rawTransaction = await TransactionMap.toPersistence(transaction);
      await trx('transactions').insert(rawTransaction);

      dispatchEventsCallback(transaction.transactionId.toString());
    });
  }

  async getTransactionsForUser(userId: string, page: number = 1, limit: number = 10): Promise<{ transactions: Transaction[], total: number }> {
    const offset = (page - 1) * limit;

    const rawTransactions = await this.db('transactions')
      .select('transactions.*', 
              'sender.fullname as sender_fullname', 
              'sender.id as sender_id', 
              'receiver.fullname as receiver_fullname', 
              'receiver.id as receiver_id')
      .leftJoin('users as sender', 'transactions.sender_id', 'sender.id')
      .leftJoin('users as receiver', 'transactions.receiver_id', 'receiver.id')
      .where('transactions.sender_id', userId)
      .orWhere('transactions.receiver_id', userId)
      .orderBy('transactions.created_at', 'desc')
      .limit(limit)
      .offset(offset);

    const totalResult = await this.db('transactions')
      .where('sender_id', userId)
      .orWhere('receiver_id', userId)
      .count('* as count')
      .first();

      const total = totalResult ? Number(totalResult.count) : 0;
      const transactions = rawTransactions.map((tnx) => TransactionMap.toDomain(tnx));

    return {
      transactions,
      total,
    };
  }

  async getTransactionsForLoan(loanId: string, page: number = 1, limit: number = 10): Promise<{ transactions: Transaction[], total: number }> {
    const offset = (page - 1) * limit;

    const rawTransactions = await this.db('transactions')
      .select('transactions.*', 
              'sender.fullname as sender_fullname', 
              'sender.id as sender_id', 
              'receiver.fullname as receiver_fullname', 
              'receiver.id as receiver_id')
      .leftJoin('users as sender', 'transactions.sender_id', 'sender.id')
      .leftJoin('users as receiver', 'transactions.receiver_id', 'receiver.id')
      .where('loan_id', loanId)
      .orderBy('transactions.created_at', 'desc')
      .limit(limit)
      .offset(offset);

    const totalResult = await this.db('transactions')
        .where('loan_id', loanId)
        .count('* as count')
        .first();

    const total = totalResult ? Number(totalResult.count) : 0;
    const transactions = rawTransactions.map((tnx) => TransactionMap.toDomain(tnx));

    return {
        transactions,
        total,
    };
  }

}

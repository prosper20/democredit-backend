import { Knex } from 'knex';

import { Transaction } from '../../domain/transaction';
import { TransactionMap } from '../../mappers/transactionMap';
import { ITransactionRepo } from '../IRepo';

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
    });
  }
}


// import { Knex } from 'knex';
// import { Transaction } from '../../domain/transaction';
// import { Wallet } from '../../domain/wallet';
// import { TransactionMap } from '../../mappers/transactionMap';
// import { ITransactionRepo } from '../transactionRepo';
// import { UniqueEntityID } from '../../../shared/domain/UniqueEntityID';

// export class KnexTransactionRepo implements ITransactionRepo {
//   private db: Knex<any, unknown[]>;

//   constructor(db: Knex<any, unknown[]>) {
//     this.db = db;
//   }

//   async createTransaction(transaction: Transaction): Promise<void> {
//     const type = transaction.type as string;
//     const amount = transaction.amount;
//     const senderId = transaction.senderId.toString();
//     const receiverId = transaction.receiverId.toString();

//     // Start a transaction
//     await this.db.transaction(async (trx) => {
//       // Debit the sender's wallet
//       const senderWallet = await trx('wallets').where({ user_id: senderId }).first();
//       if (!senderWallet) throw new Error("Sender wallet not found.");

//       const newSenderBalance = parseFloat(senderWallet.balance) - amount;
//       if (newSenderBalance < 0) throw new Error("Insufficient funds in sender's wallet.");

//       await trx('wallets')
//         .where({ user_id: senderId })
//         .update({ balance: newSenderBalance });

//       // Credit the receiver's wallet
//       const receiverWallet = await trx('wallets').where({ user_id: receiverId }).first();
//       if (!receiverWallet) throw new Error("Receiver wallet not found.");

//       const newReceiverBalance = parseFloat(receiverWallet.balance) + amount;

//       await trx('wallets')
//         .where({ user_id: receiverId })
//         .update({ balance: newReceiverBalance });

//       // Create the transaction record
//       const rawTransaction = await TransactionMap.toPersistence(transaction);
//       await trx('transactions').insert(rawTransaction);
//     });
//   }
// }

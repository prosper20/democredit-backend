import { Mapper } from "../../../shared/utils/Mapper";
import { Transaction } from "../domain/transaction";
import { UniqueEntityID } from "../../../shared/domain/UniqueEntityID";
import { TransactionDTO } from "../dtos/transactionDTO";

export class TransactionMap implements Mapper<Transaction> {
  public static toDTO(transaction: Transaction): TransactionDTO {
    let from = transaction.sender;
    let to = transaction.receiver;

    if (transaction.type === "DEPOSIT"){
      from = "Deposit from External account"
      to = transaction.receiver
    }

    if (transaction.type === "WITHDRAWAL") {
      from = transaction.sender
      to = "Withdrawal to External account"
    }

    return {
      transactionId: transaction.transactionId.toString(),
      amount: `${transaction.amount}`,
      from,
      to,
      type: transaction.type,
      loanId: transaction.loanId ? transaction.loanId.toString() : null,
      createdAt: transaction.createdAt.toISOString(),
    };
  }

  public static toDomain(raw: any): Transaction {
    const transactionOrError = Transaction.create(
      {
        amount: parseFloat(raw.amount),
        type: raw.type,
        sender: raw.sender_fullname ? raw.sender_fullname : undefined,
        senderId: raw.sender_id ? new UniqueEntityID(raw.sender_id) : undefined,
        receiver: raw.receiver_fullname ? raw.receiver_fullname : undefined,
        receiverId: raw.receiver_id ? new UniqueEntityID(raw.receiver_id) : undefined,
        loanId: raw.loan_id ? new UniqueEntityID(raw.loan_id) : null,
        createdAt: new Date(raw.created_at),
        updatedAt: raw.updated_at ? new Date(raw.updated_at) : undefined,
      },
      new UniqueEntityID(raw.id)
    );

    if (transactionOrError.isFailure) {
      console.log(transactionOrError.getErrorValue());
      return null; 
    }

    return transactionOrError.getValue();
  }

  public static async toPersistence(transaction: Transaction): Promise<any> {
    return {
      id: transaction.transactionId.toString(),
      amount: transaction.amount,
      type: transaction.type,
      sender_id: transaction.senderId ? transaction.senderId.toString() : null,
      receiver_id: transaction.receiverId ? transaction.receiverId.toString() : null,
      loan_id: transaction.loanId ? transaction.loanId.toString() : null,
      created_at: transaction.createdAt,
      updated_at: transaction.updatedAt ? transaction.updatedAt : null,
    };
  }
}

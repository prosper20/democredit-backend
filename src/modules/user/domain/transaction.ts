import { AggregateRoot } from "../../../shared/";
import { Guard } from "../../../shared/core/Guard";
import { Result } from "../../../shared/core/Result";
import { Entity } from "../../../shared/domain/Entity";
import { UniqueEntityID } from "../../../shared/domain/UniqueEntityID";
import { RepaymentMade } from "./events/repaymentMade";
import { TransactionType } from "./transactionType";

export interface TransactionProps {
  amount: number;
  type: TransactionType;
  sender?: string;
  senderId?: UniqueEntityID;
  receiver?: string;
  receiverId?: UniqueEntityID;
  loanId?: UniqueEntityID | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Transaction extends AggregateRoot<TransactionProps> {
  get transactionId() {
    return this._id;
  }
  get amount() {
    return this.props.amount;
  }
  get type() {
    return this.props.type;
  }
  get sender() {
    return this.props.sender;
  }
  get senderId() {
    return this.props.senderId;
  }
  get receiver() {
    return this.props.receiver;
  }
  get receiverId() {
    return this.props.receiverId;
  }
  get loanId() {
    return this.props.loanId;
  }
  get createdAt() {
    return this.props.createdAt;
  }
  get updatedAt() {
    return this.props.updatedAt;
  }

  private constructor(props: TransactionProps, id?: UniqueEntityID) {
    super(props, id);
  }

  public static create(props: TransactionProps, id?: UniqueEntityID): Result<Transaction> {
    const nullGuard = Guard.againstNullOrUndefinedBulk([
      { argument: props.amount, argumentName: "amount" },
      { argument: props.type, argumentName: "type" },
    ]);

    if (nullGuard.isFailure) {
      return Result.fail<Transaction>(nullGuard.getErrorValue());
    } else {
      const transaction = new Transaction(
        {
          ...props,
        },
        id,
      );

      if (transaction.type === "REPAYMENT") {
      transaction.addDomainEvent(new RepaymentMade(transaction));
    }

      return Result.ok<Transaction>(transaction);
    }
  }
}

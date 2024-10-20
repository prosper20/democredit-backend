import { Transaction } from "../transaction";
import { IDomainEvent } from "../../../../shared/domain/events/IDomainEvent";
import { UniqueEntityID } from "../../../../shared/domain/UniqueEntityID";

export class RepaymentMade implements IDomainEvent {
  public dateTimeOccurred: Date;
  public transaction: Transaction;

  constructor (transaction: Transaction) {
    this.dateTimeOccurred = new Date();
    this.transaction = transaction;
  }

  public getAggregateId (): UniqueEntityID {
    return this.transaction.transactionId;
  }
}
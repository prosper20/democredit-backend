import { Loan } from "../loan";
import { IDomainEvent } from "../../../../shared/domain/events/IDomainEvent";
import { UniqueEntityID } from "../../../../shared/domain/UniqueEntityID";

export class LoanApproved implements IDomainEvent {
  public dateTimeOccurred: Date;
  public loan: Loan;

  constructor (loan: Loan) {
    this.dateTimeOccurred = new Date();
    this.loan = loan;
  }

  public getAggregateId (): UniqueEntityID {
    return this.loan.loanId;
  }
}
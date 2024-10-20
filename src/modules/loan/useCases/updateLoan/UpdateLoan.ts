import { Loan } from "../../domain/loan";
import { UniqueEntityID, UseCase } from "../../../../shared";
import { ILoanRepo } from "../../repos/IRepo";
import { Transaction } from "../../../user/domain/transaction";


interface Event {
  dateTimeOccurred: Date;
  transaction: Transaction;
  getAggregateId(): UniqueEntityID;
}

export class UpdateLoan implements UseCase<Event, Promise<void>> {
  private loanRepo: ILoanRepo;

  constructor(loanRepo: ILoanRepo) {
    this.loanRepo = loanRepo;
  }

  public async execute(event: Event): Promise<void> {
    const transaction = event.transaction;
    let loan: Loan;

    try {
      loan = await this.loanRepo.getLoan(transaction.loanId.toString());
    } catch (error) {
      console.log("failed to update loan after repayment: loan could not be found.")
      return;
    }

    loan.makePayment(transaction.amount)

    if (loan.outstandingBalance <= 0) loan.updateStatus('COMPLETED')
      
    await this.loanRepo.saveLoan(loan);

    return;
  }
}
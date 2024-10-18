import { Loan } from "../../../loan/domain/loan";
import { UniqueEntityID, UseCase } from "../../../../shared";
import { ITransactionRepo } from "../../repos/IRepo";
import { Transaction } from "../../domain/transaction";

interface Event {
  dateTimeOccurred: Date;
  loan: Loan;
  getAggregateId(): UniqueEntityID;
}

export class DisburseLoan implements UseCase<Event, Promise<void>> {
  private transactionRepo: ITransactionRepo;

  constructor(transactionRepo: ITransactionRepo) {
    this.transactionRepo = transactionRepo;
  }

  public async execute(event: Event): Promise<void> {
    const loan = event.loan;

      const transactionOrError = Transaction.create({
        amount: loan.amount,
        type: "DISBURSEMENT",
        senderId: loan.loanerId,
        receiverId: loan.userId,
        loanId: loan.loanId,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

    if (transactionOrError.isFailure) {
        return;
      }

    const transaction = transactionOrError.getValue();

      try {
        await this.transactionRepo.createTransaction(transaction);

      } catch (error) {
        console.log("automatic disbursement failed")
        // insufficient funds in disbursment wallet, send email to admin
      }
    return;
  }
}
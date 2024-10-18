import { Loan } from "../domain/loan"
import { LoanOffer } from "../domain/loanOffer"

export interface ILoanRepo {
  saveLoanOffer(loanOffer: LoanOffer): Promise<void>
  getLoanOffer(loanOfferId: string): Promise<LoanOffer>
  saveLoan(loan: Loan): Promise<void>
}
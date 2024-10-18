import { Loan } from "../domain/loan"
import { LoanOffer } from "../domain/loanOffer"

export interface ILoanRepo {
  saveLoanOffer(loanOffer: LoanOffer): Promise<void>
  getLoanOffer(loanOfferId: string): Promise<LoanOffer>
  getLoanOffers(page: number, limit: number): Promise<{loanOffers: LoanOffer[], total: number}>
  saveLoan(loan: Loan): Promise<void>
  getLoan(loanId: string): Promise<Loan>
  getLoansForUser(userId: string,page: number, limit: number, status: string): Promise<{loans: Loan[], total: number}>
  getLoansForAdmin(loanerId: string,page: number, limit: number, status: string): Promise<{loans: Loan[], total: number}>
}
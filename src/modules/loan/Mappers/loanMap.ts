import { Mapper } from "../../../shared/utils/Mapper";
import { Loan } from "../domain/loan";
import { UniqueEntityID } from "../../../shared/domain/UniqueEntityID";
import { LoanDTO } from "../dtos/loanDTO";

export class LoanMap implements Mapper<Loan> {
    public static toDTO(loan: Loan): LoanDTO {
    return {
        loanId: loan.loanId.toString(),
        userId: loan.userId.toString(),
        offerId: loan.offerId.toString(),
        status: loan.status.toString(),
        amount: loan.amount.toFixed(2),
        interestRate: loan.interestRate.toFixed(2),
        duration: loan.duration,
        totalRepayment: loan.totalRepayment.toFixed(2),
        monthlyRepayment: loan.monthlyRepayment.toFixed(2),
        totalInterest: loan.totalInterest.toFixed(2),
        totalPaid: loan.totalPaid.toFixed(2),
        outstandingBalance: loan.outstandingBalance.toFixed(2),
        createdAt: loan.createdAt.toISOString(),
    };
}

  public static async toPersistence(loan: Loan): Promise<any> {
    return {
      id: loan.loanId.toString(),
      user_id: loan.userId.toString(),
      offer_id: loan.offerId.toString(),
      status: loan.status,
      amount: loan.amount,
      interest_rate: loan.interestRate,
      duration: loan.duration,
      total_repayment: loan.totalRepayment,
      monthly_repayment: loan.monthlyRepayment,
      total_interest: loan.totalInterest,
      total_paid: loan.totalPaid,
      outstanding_balance: loan.outstandingBalance,
      created_at: loan.createdAt,
      updated_at: loan.updatedAt ? loan.updatedAt : null,
    };
  }

  public static toDomain(raw: any): Loan {
    const loanOrError = Loan.create(
      {
        userId: new UniqueEntityID(raw.user_id),
        offerId: new UniqueEntityID(raw.offer_id),
        status: raw.status,
        amount: parseFloat(raw.amount),
        interestRate: parseFloat(raw.interest_rate),
        duration: raw.duration,
        totalRepayment: parseFloat(raw.total_repayment),
        monthlyRepayment: parseFloat(raw.monthly_repayment),
        totalInterest: parseFloat(raw.total_interest),
        totalPaid: parseFloat(raw.total_paid),
        outstandingBalance: parseFloat(raw.outstanding_balance),
        createdAt: new Date(raw.created_at),
        updatedAt: raw.updated_at ? new Date(raw.updated_at) : undefined,
      },
      new UniqueEntityID(raw.id)
    );

    if (loanOrError.isFailure) {
      console.log(loanOrError.getErrorValue());
      return null; 
    }

    return loanOrError.getValue();
  }
}

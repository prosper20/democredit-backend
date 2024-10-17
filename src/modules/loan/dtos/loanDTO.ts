export interface LoanDTO {
    loanId: string;
    userId: string;
    offerId: string;
    status: string;
    amount: string;
    interestRate: string;
    duration: number;
    totalRepayment: string;
    monthlyRepayment: string;
    totalInterest: string;
    totalPaid: string;
    outstandingBalance: string;
    createdAt: string;
}

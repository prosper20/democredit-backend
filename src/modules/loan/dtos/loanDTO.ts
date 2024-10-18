export interface LoanDTO {
    loanId: string;
    userId: string;
    loanerId: string;
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

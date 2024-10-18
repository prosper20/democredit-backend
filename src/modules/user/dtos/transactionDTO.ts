
export interface TransactionDTO {
    transactionId: string;
    amount: string;
    type: string;
    from: string;
    to: string;
    loanId?: string;
    createdAt : string;
}
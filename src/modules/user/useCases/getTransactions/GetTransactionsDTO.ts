import { TransactionDTO } from "../../dtos/transactionDTO";

export interface GetTransactionsResponseDTO {
  page: number,
  hasNextPage: boolean,
  hasPreviousPage: boolean,
  nextPage: number,
  previousPage: number,
  lastPage: number,
  transactions: TransactionDTO[];
}

export interface GetTransactionsRequestDTO {
  userId?: string;
  page?: number;
  limit?: number;
}

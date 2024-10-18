import { LoanDTO } from "../../dtos/loanDTO";

export interface GetLoansResponseDTO {
  page: number,
  hasNextPage: boolean,
  hasPreviousPage: boolean,
  nextPage: number,
  previousPage: number,
  lastPage: number,
  loans: LoanDTO[];
}

export interface GetLoansRequestDTO {
  userId: string;
  role: string;
  page: number;
  limit: number;
  status: string;
}

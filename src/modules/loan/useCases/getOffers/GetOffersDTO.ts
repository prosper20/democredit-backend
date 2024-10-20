import { LoanOfferDTO } from "../../dtos/loanOfferDTO";

export interface GetOffersResponseDTO {
  page: number,
  hasNextPage: boolean,
  hasPreviousPage: boolean,
  nextPage: number,
  previousPage: number,
  lastPage: number,
  loanOffers: LoanOfferDTO[];
}

export interface GetOffersRequestDTO {
  page?: number;
  limit?: number;
}

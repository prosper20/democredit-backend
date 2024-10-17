export interface DepositRequestDTO {
  email: string;
  amount: string;
}

export interface DepositResponseDTO {
  status: string;
  message: string;
}
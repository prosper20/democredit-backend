export interface WithdrawRequestDTO {
  userId: string;
  amount: string;
}

export interface WithdrawResponseDTO {
  status: string;
  message: string;
}
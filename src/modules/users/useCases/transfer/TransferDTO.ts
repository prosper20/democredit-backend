export interface TransferRequestDTO {
  senderId: string;
  receiverId: string;
  amount: string;
  type: string;
  loanId?: string;
}

export interface TransferResponseDTO {
  status: string;
  type: string;
  message: string;
}
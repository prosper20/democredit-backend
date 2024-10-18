import { AppError, UniqueEntityID, UseCase } from "../../../../shared";
import { Either, left, Result, right } from "../../../../shared/core/Result";
import { Transaction } from "../../domain/transaction";
import { TransactionType } from "../../domain/transactionType";
import { User } from "../../domain/user";
import { ITransactionRepo, IUserRepo } from "../../repos/IRepo";
import { TransferRequestDTO, TransferResponseDTO } from "./TransferDTO";
import { TransferErrors } from "./TransferErrors";

type Response = Either<
  | TransferErrors.CannotTransferToSelfError
  | TransferErrors.ReceiverNotFoundError
  | TransferErrors.NoLoanIdError
  | TransferErrors.TransferError
  | AppError.UnexpectedError
  | Result<any>,
  Result<TransferResponseDTO>
>;

export class TransferUseCase implements UseCase<TransferRequestDTO, Promise<Response>> {
  private transactionRepo: ITransactionRepo;
  private userRepo: IUserRepo;

  constructor(transactionRepo: ITransactionRepo, userRepo: IUserRepo) {
    this.transactionRepo = transactionRepo;
    this.userRepo = userRepo;
  }

  async execute(request: TransferRequestDTO): Promise<Response> {
    let receiver: User;
    
    if ((request.type !== "TRANSFER") && (!request.loanId)) {
      return left(new TransferErrors.NoLoanIdError(request.type)) as Response;
    }

    if (request.senderId === request.receiverId){
      return left(new TransferErrors.CannotTransferToSelfError()) as Response;
    }

    try {
      try {
        receiver = await this.userRepo.getUserByUserId(request.receiverId);
      } catch (error) {
        return left(new TransferErrors.ReceiverNotFoundError());
      }

      const transactionOrError = Transaction.create({
        amount: parseFloat(request.amount),
        type: request.type as TransactionType,
        senderId: new UniqueEntityID(request.senderId),
        receiverId: new UniqueEntityID(request.receiverId),
        loanId: request.loanId ? new UniqueEntityID(request.loanId) : null,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

    if (transactionOrError.isFailure) {
        return left(new TransferErrors.TransferError(transactionOrError.getErrorValue().toString())) as Response;
      }

    const transaction = transactionOrError.getValue();

      try {
        await this.transactionRepo.createTransaction(transaction);

      } catch (error) {
        return left(new TransferErrors.TransferError(error.message));
      }

      return right(
        Result.ok<TransferResponseDTO>({
          status: "success",
          type: request.type,
          message: `You transfered ${request.amount} to ${receiver.fullName.value}`,
        }),
      );
      
    } catch (error) {
      return left(new AppError.UnexpectedError(error)) as Response;
    }
  }
}

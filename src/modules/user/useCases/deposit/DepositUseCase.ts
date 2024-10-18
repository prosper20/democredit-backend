import { AppError, UseCase } from "../../../../shared";
import { Either, left, Result, right } from "../../../../shared/core/Result";
import { Transaction } from "../../domain/transaction";
import { User } from "../../domain/user";
import { ITransactionRepo, IUserRepo } from "../../repos/IRepo";
import { DepositRequestDTO, DepositResponseDTO } from "./DepositDTO";
import { DepositErrors } from "./DepositErrors";

type Response = Either<
  | DepositErrors.UserNotFoundError
  | DepositErrors.TransactionError
  | AppError.UnexpectedError
  | Result<any>,
  Result<DepositResponseDTO>
>;

export class DepositUseCase implements UseCase<DepositRequestDTO, Promise<Response>> {
  private transactionRepo: ITransactionRepo;
  private userRepo: IUserRepo;

  constructor(transactionRepo: ITransactionRepo, userRepo: IUserRepo) {
    this.transactionRepo = transactionRepo;
    this.userRepo = userRepo;
  }

  async execute(request: DepositRequestDTO): Promise<Response> {
    let receiver: User;

    try {
      try {
        receiver = await this.userRepo.getUserByEmail(request.email);
      } catch (error) {
        return left(new DepositErrors.UserNotFoundError());
      }

      const transactionOrError = Transaction.create({
        amount: parseFloat(request.amount),
        type: "DEPOSIT",
        senderId: receiver.userId.getValue(),
        receiverId: receiver.userId.getValue(),
        loanId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

    if (transactionOrError.isFailure) {
        return left(new DepositErrors.TransactionError(transactionOrError.getErrorValue().toString())) as Response;
      }

    const transaction = transactionOrError.getValue();

      try {
        await this.transactionRepo.createTransaction(transaction);

      } catch (error) {
        return left(new DepositErrors.TransactionError(error.message));
      }

      return right(
        Result.ok<DepositResponseDTO>({
          status: "success",
          message: `You deposited ${request.amount} to ${receiver.fullName.value}`,
        }),
      );
      
    } catch (error) {
      return left(new AppError.UnexpectedError(error)) as Response;
    }
  }
}

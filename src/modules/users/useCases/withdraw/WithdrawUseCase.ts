import { AppError, UseCase } from "../../../../shared";
import { Either, left, Result, right } from "../../../../shared/core/Result";
import { Transaction } from "../../domain/transaction";
import { User } from "../../domain/user";
import { ITransactionRepo, IUserRepo } from "../../repos/IRepo";
import { WithdrawRequestDTO, WithdrawResponseDTO } from "./WithdrawDTO";
import { WithdrawErrors } from "./WithdrawErrors";

type Response = Either<
  | WithdrawErrors.UserNotFoundError
  | WithdrawErrors.TransactionError
  | AppError.UnexpectedError
  | Result<any>,
  Result<WithdrawResponseDTO>
>;

export class WithdrawUseCase implements UseCase<WithdrawRequestDTO, Promise<Response>> {
  private transactionRepo: ITransactionRepo;
  private userRepo: IUserRepo;

  constructor(transactionRepo: ITransactionRepo, userRepo: IUserRepo) {
    this.transactionRepo = transactionRepo;
    this.userRepo = userRepo;
  }

  async execute(request: WithdrawRequestDTO): Promise<Response> {
    let user: User;

    try {
      try {
        user = await this.userRepo.getUserByUserId(request.userId);
      } catch (error) {
        return left(new WithdrawErrors.UserNotFoundError());
      }

      const transactionOrError = Transaction.create({
        amount: parseFloat(request.amount),
        type: "WITHDRAWAL",
        senderId: user.userId.getValue(),
        receiverId: user.userId.getValue(),
        loanId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

    if (transactionOrError.isFailure) {
        return left(new WithdrawErrors.TransactionError(transactionOrError.getErrorValue().toString())) as Response;
      }

    const transaction = transactionOrError.getValue();

      try {
        await this.transactionRepo.createTransaction(transaction);

      } catch (error) {
        return left(new WithdrawErrors.TransactionError(error.message));
      }

      return right(
        Result.ok<WithdrawResponseDTO>({
          status: "success",
          message: `${request.amount} was successfully withdrawn from your wallet.`,
        }),
      );
      
    } catch (error) {
      return left(new AppError.UnexpectedError(error)) as Response;
    }
  }
}

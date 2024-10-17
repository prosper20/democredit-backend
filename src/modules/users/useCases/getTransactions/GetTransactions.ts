import { AppError, Either, left, Result, right, UseCase } from "../../../../shared";
import { Transaction } from "../../domain/transaction";
import { ITransactionRepo } from "../../repos/IRepo";
import { GetTransactionsRequestDTO } from "./GetTransactionsDTO";

type Response = Either<AppError.UnexpectedError, Result<{ transactions: Transaction[], total: number }>>;

export class GetTransactions implements UseCase<GetTransactionsRequestDTO, Promise<Response>> {
  private transactionRepo: ITransactionRepo;

  constructor(transactionRepo: ITransactionRepo) {
    this.transactionRepo = transactionRepo;
  }

  public async execute(req: GetTransactionsRequestDTO): Promise<Response> {

    try {
      const {transactions, total } = await this.transactionRepo.getTransactionsForUser(req.userId, req.page, req.limit);
      return right(Result.ok<{ transactions: Transaction[], total: number }>({transactions, total } ));
    } catch (err) {
      return left(new AppError.UnexpectedError(err));
    }
  }
}

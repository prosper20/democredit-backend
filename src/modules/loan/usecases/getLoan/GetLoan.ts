import { AppError, Either, left, Result, right, UseCase } from "../../../../shared";
import { Loan } from "../../domain/loan";
import { ILoanRepo } from "../../repos/IRepo";
import { GetLoanErrors } from "./GetLoanErrors";
import { GetLoanRequestDTO } from "./GetLoanDTO";

type Response = Either<GetLoanErrors.NotFoundError 
| GetLoanErrors.UserNotFound
| AppError.UnexpectedError, Result<Loan>>;

export class GetLoan implements UseCase<GetLoanRequestDTO, Promise<Response>> {
  private loanRepo: ILoanRepo;

  constructor(loanRepo: ILoanRepo) {
    this.loanRepo = loanRepo;
  }

  public async execute(req: GetLoanRequestDTO): Promise<Response> {

    try {
      const loan = await this.loanRepo.getLoan(req.loanId);
      return right(Result.ok<Loan>(loan));
    } catch (err) {
      return left(new GetLoanErrors.NotFoundError()) as Response;
    }
  }
}

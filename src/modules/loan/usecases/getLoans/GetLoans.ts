import { AppError, Either, left, Result, right, UseCase } from "../../../../shared";
import { Loan } from "../../domain/loan";
import { ILoanRepo } from "../../repos/IRepo";
import { GetLoansRequestDTO } from "./GetLoansDTO";

type Response = Either<AppError.UnexpectedError, Result<{ loans: Loan[], total: number }>>;

export class GetLoans implements UseCase<GetLoansRequestDTO, Promise<Response>> {
  private loanRepo: ILoanRepo;

  constructor(loanRepo: ILoanRepo) {
    this.loanRepo = loanRepo;
  }

  public async execute(req: GetLoansRequestDTO): Promise<Response> {

    try {
      if(req.role === "USER"){
        const {loans, total } = await this.loanRepo.getLoansForUser(req.userId, req.page, req.limit, req.status);
      return right(Result.ok<{ loans: Loan[], total: number }>({loans, total } ));
      }

      const {loans, total } = await this.loanRepo.getLoansForAdmin(req.userId, req.page, req.limit, req.status);
      return right(Result.ok<{ loans: Loan[], total: number }>({loans, total } ));
    } catch (err) {
      return left(new AppError.UnexpectedError(err));
    }
  }
}

import { AppError, Either, left, Result, right, UniqueEntityID, UseCase } from "../../../../shared";
import { Loan, LoanProps } from "../../domain/loan";
import { LoanStatus } from "../../domain/loanStatus";
import { ILoanRepo } from "../../repos/IRepo";
import { ApproveRejectDTO } from "./ApproveRejectDTO";
import { ApproveRejectErrors } from "./ApproveRejectErrors";

type Response = Either<
  | ApproveRejectErrors.LoanNotFoundError
  | ApproveRejectErrors.UserNotFound
  | ApproveRejectErrors.ValidationError
  | AppError.UnexpectedError
  | Result<any>,
  Result<void>
>;

export class ApproveReject implements UseCase<ApproveRejectDTO, Promise<Response>> {
  private loanRepo: ILoanRepo;

  constructor(loanRepo: ILoanRepo) {
    this.loanRepo = loanRepo;
  }

  async execute(request: ApproveRejectDTO): Promise<Response> {
    let loan: Loan;

    try {

      try {
          loan = await this.loanRepo.getLoan(request.loanId);
        } catch (error) {
          return left(new ApproveRejectErrors.LoanNotFoundError()) as Response;
        }

      loan.updateStatus(request.type as LoanStatus)
      await this.loanRepo.saveLoan(loan);

      return right(Result.ok<void>()) as Response;
    } catch (err) {
      return left(new AppError.UnexpectedError(err)) as Response;
    }
  }
}

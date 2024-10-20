import { AppError, Either, left, Result, right, UseCase } from "../../../../shared";
import { LoanOffer } from "../../domain/loanOffer";
import { ILoanRepo } from "../../repos/IRepo";
import { GetOffersRequestDTO } from "./GetOffersDTO";

type Response = Either<AppError.UnexpectedError, Result<{ loanOffers: LoanOffer[], total: number }>>;

export class GetOffers implements UseCase<GetOffersRequestDTO, Promise<Response>> {
  private loanRepo: ILoanRepo;

  constructor(loanRepo: ILoanRepo) {
    this.loanRepo = loanRepo;
  }

  public async execute(req: GetOffersRequestDTO): Promise<Response> {

    try {
      const {loanOffers, total } = await this.loanRepo.getLoanOffers(req.page, req.limit);
      return right(Result.ok<{ loanOffers: LoanOffer[], total: number }>({loanOffers, total } ));
    } catch (err) {
      return left(new AppError.UnexpectedError(err));
    }
  }
}

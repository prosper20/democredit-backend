import { AppError, Either, left, Result, right, UseCase } from "../../../../shared";
import { LoanOffer } from "../../domain/loanOffer";
import { ILoanRepo } from "../../repos/IRepo";
import { GetOfferRequestDTO } from "./GetOfferDTO";
import { GetLoanOfferErrors } from "./GetOfferErrors";

type Response = Either<GetLoanOfferErrors.OfferNotFoundError 
| GetLoanOfferErrors.UserNotFound 
| AppError.UnexpectedError, Result<LoanOffer>>;

export class GetOffer implements UseCase<GetOfferRequestDTO, Promise<Response>> {
  private loanRepo: ILoanRepo;

  constructor(loanRepo: ILoanRepo) {
    this.loanRepo = loanRepo;
  }

  public async execute(req: GetOfferRequestDTO): Promise<Response> {

    try {
      const loanOffer = await this.loanRepo.getLoanOffer(req.offerId);
      return right(Result.ok<LoanOffer>(loanOffer ));
    } catch (err) {
      return left(new GetLoanOfferErrors.OfferNotFoundError()) as Response;
    }
  }
}

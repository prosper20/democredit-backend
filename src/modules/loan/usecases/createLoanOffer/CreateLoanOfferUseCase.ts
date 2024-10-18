import { AppError, Either, left, Result, right, UniqueEntityID, UseCase } from "../../../../shared";
import { LoanOffer, LoanOfferProps } from "../../domain/loanOffer";
import { ILoanRepo } from "../../repos/IRepo";
import { CreateLoanOfferDTO } from "./CreateLoanOfferDTO";
import { CreateLoanOfferErrors } from "./CreateLoanOfferErrors";

type Response = Either<
  | CreateLoanOfferErrors.UserNotFound
  | CreateLoanOfferErrors.ValidationError
  | AppError.UnexpectedError
  | Result<any>,
  Result<void>
>;

export class CreateLoanOfferUseCase implements UseCase<CreateLoanOfferDTO, Promise<Response>> {
  private loanRepo: ILoanRepo;

  constructor(loanRepo: ILoanRepo) {
    this.loanRepo = loanRepo;
  }

  async execute(request: CreateLoanOfferDTO): Promise<Response> {
    
    try {

      const loanOfferValues: LoanOfferProps = {
        name: request.name,
        tenure: parseInt(request.tenure, 10),
        maxAmount: parseFloat(request.maxAmount),
        interestRate: parseFloat(request.interestRate),
        loanerId: new UniqueEntityID(request.userId),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const loanOfferOrError = LoanOffer.create(loanOfferValues);

      if (loanOfferOrError.isFailure) {
        return left(
          new CreateLoanOfferErrors.ValidationError(loanOfferOrError.getErrorValue().toString()),
        ) as Response;
      }

      const loanOffer: LoanOffer = loanOfferOrError.getValue();
      await this.loanRepo.saveLoanOffer(loanOffer);

      return right(Result.ok<void>()) as Response;
    } catch (err) {
      return left(new AppError.UnexpectedError(err)) as Response;
    }
  }
}

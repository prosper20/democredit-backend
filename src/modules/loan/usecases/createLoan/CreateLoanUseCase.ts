import { AppError, Either, left, Result, right, UniqueEntityID, UseCase } from "../../../../shared";
import { Loan, LoanProps } from "../../domain/loan";
import { ILoanRepo } from "../../repos/IRepo";
import { CreateLoanDTO } from "./CreateLoanDTO";
import { CreateLoanErrors } from "./CreateLoanErrors";

type Response = Either<
  | CreateLoanErrors.OfferNotFoundError
  | CreateLoanErrors.UserNotFound
  | CreateLoanErrors.ValidationError
  | AppError.UnexpectedError
  | Result<any>,
  Result<Loan>
>;

export class CreateLoanUseCase implements UseCase<CreateLoanDTO, Promise<Response>> {
  private loanRepo: ILoanRepo;

  constructor(loanRepo: ILoanRepo) {
    this.loanRepo = loanRepo;
  }

  async execute(request: CreateLoanDTO): Promise<Response> {
    let loanerId: string;
    let interestRate: number;
    const amount = parseFloat(request.amount);
    const duration = parseInt(request.duration, 10); 
    try {

      try {
          const offer = await this.loanRepo.getLoanOffer(request.offerId);
          loanerId = offer.loanerId.toString();
          interestRate = offer.interestRate / 100;
        } catch (error) {
          return left(new CreateLoanErrors.OfferNotFoundError()) as Response;
        }

    const monthlyInterestRate = interestRate;
    const emi = (amount * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, duration))
    /(Math.pow(1 + monthlyInterestRate, duration) - 1);
    const totalRepayment = emi * duration;
    const totalInterest = totalRepayment - amount;

      const loanValues: LoanProps = {
        userId: new UniqueEntityID(request.userId),
        loanerId: new UniqueEntityID(loanerId),
        status: "PENDING",
        amount: parseFloat(request.amount),
        interestRate,
        duration: parseInt(request.duration, 10),
        totalRepayment,
        monthlyRepayment: emi, 
        totalInterest,
        totalPaid: 0,
        outstandingBalance: totalRepayment,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const loanOrError = Loan.create(loanValues);

      if (loanOrError.isFailure) {
        return left(new CreateLoanErrors.ValidationError(loanOrError.getErrorValue().toString())) as Response;
      }

      const loan: Loan = loanOrError.getValue();
      await this.loanRepo.saveLoan(loan);

      return right(Result.ok<Loan>(loan)) as Response;
    } catch (err) {
      return left(new AppError.UnexpectedError(err)) as Response;
    }
  }
}

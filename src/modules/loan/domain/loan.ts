import { AggregateRoot, Either, Guard, left, Result, right, UniqueEntityID } from "../../../shared/";
import { LoanStatus } from "./loanStatus";


export interface LoanProps {
  userId: UniqueEntityID;
  loanerId: UniqueEntityID;
  status: LoanStatus;
  amount: number;
  interestRate: number;
  duration: number;
  totalRepayment: number;
  monthlyRepayment: number;
  totalInterest: number;
  totalPaid: number;
  outstandingBalance: number;
  createdAt: Date;
  updatedAt?: Date;
}

export class Loan extends AggregateRoot<LoanProps> {
  get loanId(){
    return this._id;
  }

  get userId(){
    return this.props.userId;
  }

  get loanerId(){
    return this.props.loanerId;
  }

  get status() {
    return this.props.status;
  }

  get amount() {
    return this.props.amount;
  }

  get interestRate(){
    return this.props.interestRate;
  }

  get duration() {
    return this.props.duration;
  }

  get totalRepayment(){
    return this.props.totalRepayment;
  }

  get monthlyRepayment(){
    return this.props.monthlyRepayment;
  }

  get totalInterest() {
    return this.props.totalInterest;
  }

  get totalPaid() {
    return this.props.totalPaid;
  }

  get outstandingBalance() {
    return this.props.outstandingBalance;
  }
  get createdAt() {
    return this.props.createdAt;
  }
  
  get updatedAt() {
    return this.props.updatedAt;
  }

  public updateStatus(newStatus: LoanStatus): void {
    this.props.status = newStatus;
  }

  public makePayment(amount: number): Either<string, void> {
    if (amount <= 0) {
      return left("Payment amount must be greater than zero.");
    }

    this.props.totalPaid += amount;
    this.props.outstandingBalance -= amount;

    return right(undefined);
  }

  private constructor(props: LoanProps, id?: UniqueEntityID) {
    super(props, id);
  }

  public static create(props: LoanProps, id?: UniqueEntityID): Result<Loan> {
    const guardResult = Guard.againstNullOrUndefinedBulk([
      { argument: props.userId, argumentName: "userId" },
      { argument: props.loanerId, argumentName: "loanerId" },
      { argument: props.amount, argumentName: "amount" },
      { argument: props.interestRate, argumentName: "interestRate" },
      { argument: props.duration, argumentName: "duration" },
      { argument: props.totalRepayment, argumentName: "totalRepayment" },
      { argument: props.monthlyRepayment, argumentName: "monthlyRepayment" },
      { argument: props.totalInterest, argumentName: "totalInterest" },
    ]);

    if (guardResult.isFailure) {
      return Result.fail<Loan>(guardResult.getErrorValue());
    }

    const loan = new Loan(
      {
        ...props,
        status: props.status ? props.status : 'PENDING',
        totalPaid: props.totalPaid ? props.totalPaid :0,
        outstandingBalance: props.outstandingBalance ? props.outstandingBalance : props.totalRepayment,
      },
      id,
    );

    return Result.ok<Loan>(loan);
  }

}

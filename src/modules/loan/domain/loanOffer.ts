import { Guard } from "../../../shared/core/Guard";
import { Result } from "../../../shared/core/Result";
import { Entity } from "../../../shared/domain/Entity";
import { UniqueEntityID } from "../../../shared/domain/UniqueEntityID";

export interface LoanOfferProps {
  name: string;
  tenure: number;
  maxAmount: number;
  interestRate: number;
  loanerId: UniqueEntityID;
  createdAt?: Date;
  updatedAt?: Date;
}

export class LoanOffer extends Entity<LoanOfferProps> {
  get loanOfferId() {
    return this._id;
  }
  
  get name() {
    return this.props.name;
  }
  
  get tenure() {
    return this.props.tenure;
  }
  
  get maxAmount() {
    return this.props.maxAmount;
  }
  
  get interestRate() {
    return this.props.interestRate;
  }

  get loanerId() {
    return this.props.loanerId;
  }
  
  get createdAt() {
    return this.props.createdAt;
  }
  
  get updatedAt() {
    return this.props.updatedAt;
  }

  private constructor(props: LoanOfferProps, id?: UniqueEntityID) {
    super(props, id);
  }

  public static create(props: LoanOfferProps, id?: UniqueEntityID): Result<LoanOffer> {
    const nullGuard = Guard.againstNullOrUndefinedBulk([
      { argument: props.name, argumentName: "name" },
      { argument: props.tenure, argumentName: "tenure" },
      { argument: props.maxAmount, argumentName: "maxAmount" },
      { argument: props.interestRate, argumentName: "interestRate" },
      { argument: props.loanerId, argumentName: "loanerId" },
    ]);

    if (nullGuard.isFailure) {
      return Result.fail<LoanOffer>(nullGuard.getErrorValue());
    } else {
      const loanOffer = new LoanOffer(
        {
          ...props,
        },
        id,
      );

      return Result.ok<LoanOffer>(loanOffer);
    }
  }
}

import { Result } from "../../../../shared/core/Result";
import { UseCaseError } from "../../../../shared/core/UseCaseError";

export namespace GetLoanOfferErrors {
  export class OfferNotFoundError extends Result<UseCaseError> {
    constructor() {
      super(false, {
        message: "Loan offer not found",
      } as UseCaseError);
    }
  }

  export class UserNotFound extends Result<UseCaseError> {
    constructor() {
      super(false, {
        message: "Unexpected Error, Please login again",
      } as UseCaseError);
    }
  }


  export class ValidationError extends Result<UseCaseError> {
    constructor(message: string) {
      super(false, {
        message,
      } as UseCaseError);
    }
  }
}

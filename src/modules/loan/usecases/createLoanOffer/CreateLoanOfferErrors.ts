import { Result } from "../../../../shared/core/Result";
import { UseCaseError } from "../../../../shared/core/UseCaseError";

export namespace CreateLoanOfferErrors {
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

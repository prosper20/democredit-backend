import { Result } from "../../../../shared/core/Result";
import { UseCaseError } from "../../../../shared/core/UseCaseError";

export namespace RegisterUserErrors {
  export class EmailAlreadyExistsError extends Result<UseCaseError> {
    constructor(email: string) {
      super(false, {
        message: `The email ${email} already exists`,
      } as UseCaseError);
    }
  }

  export class PasswordMismatchError extends Result<UseCaseError> {
    constructor() {
      super(false, {
        message: "Passwords do not match",
      } as UseCaseError);
    }
  }

  export class UserBlacklistedError extends Result<UseCaseError> {
    constructor() {
      super(false, {
        message: "Your request to join this service has been declined",
      } as UseCaseError);
    }
  }

  export class ErrorCheckingBlacklist extends Result<UseCaseError> {
    constructor() {
      super(false, {
        message: "Credibility validation failed. Please try again.",
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

import { Result } from "../../../../shared/core/Result";
import { UseCaseError } from "../../../../shared/core/UseCaseError";

export namespace LoginUseCaseErrors {
  export class EmailDoesntExistError extends Result<UseCaseError> {
    constructor() {
      super(false, {
        message: `Incorrect email or password`,
      } as UseCaseError);
    }
  }

  export class IncorrectPasswordError extends Result<UseCaseError> {
    constructor() {
      super(false, {
        message: `Incorrect email or password`,
      } as UseCaseError);
    }
  }
}

import { Result, UseCaseError } from '../../../../shared';

export namespace DepositErrors {

  export class UserNotFoundError extends Result<UseCaseError> {
    constructor() {
      super(false, {
        message: "Account could not be found.",
      } as UseCaseError);
    }
  }

  export class TransactionError extends Result<UseCaseError> {
    constructor(message: string) {
      super(false, {
        message: `Deposit failed: ${message}`,
      } as UseCaseError);
    }
  }


}

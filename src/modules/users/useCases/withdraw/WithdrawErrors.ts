import { Result, UseCaseError } from '../../../../shared';

export namespace WithdrawErrors {

  export class UserNotFoundError extends Result<UseCaseError> {
    constructor() {
      super(false, {
        message: "Account not be found. Please Login again",
      } as UseCaseError);
    }
  }

  export class TransactionError extends Result<UseCaseError> {
    constructor(message: string) {
      super(false, {
        message: `Withdrawal failed: ${message}`,
      } as UseCaseError);
    }
  }


}

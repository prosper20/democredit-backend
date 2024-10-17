import { Result, UseCaseError } from '../../../../shared';

export namespace TransferErrors {
  
  export class CannotTransferToSelfError extends Result<UseCaseError> {
    constructor() {
      super(false, {
        message: "You cannot transfer to your own account.",
      } as UseCaseError);
    }
  }

  export class ReceiverNotFoundError extends Result<UseCaseError> {
    constructor() {
      super(false, {
        message: "Recipient account could not be found.",
      } as UseCaseError);
    }
  }

  export class NoLoanIdError extends Result<UseCaseError> {
  constructor(type: string) {
    super(false, {
      message: `Please provide the id of the loan for this ${type}.`,
    } as UseCaseError);
  }
}


  export class TransferError extends Result<UseCaseError> {
    constructor(message: string) {
      super(false, {
        message: `Transaction failed: ${message}`,
      } as UseCaseError);
    }
  }


}

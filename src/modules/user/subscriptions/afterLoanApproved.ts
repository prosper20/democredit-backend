import { DomainEvents } from "../../../shared/domain/events/DomainEvents";
import { IHandle } from "../../../shared/domain/events/IHandle";
import { LoanApproved } from "../../loan/domain/events/loanApproved";
import { DisburseLoan } from "../useCases/disburseLoan/DisburseLoan";

export class AfterLoanApproved implements IHandle<LoanApproved> {
  private disburseLoan: DisburseLoan; 

  constructor(disburseLoan: DisburseLoan) {
    this.setupSubscriptions();
    this.disburseLoan = disburseLoan;
  }

  setupSubscriptions(): void {
    DomainEvents.register(this.onLoanApproved.bind(this), LoanApproved.name);
  }

  private async onLoanApproved(event: LoanApproved): Promise<void> {
    try {
      await this.disburseLoan.execute(event);
      console.log(`[AfterLoanApproved]: Successfully executed disburseLoan usecase.`);
    } catch (err) {
      console.log(`[AfterLoanApproved]: Failed to execute disburseLoan usecase.`);
    }
  }
}

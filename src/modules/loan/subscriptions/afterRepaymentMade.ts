import { DomainEvents } from "../../../shared/domain/events/DomainEvents";
import { IHandle } from "../../../shared/domain/events/IHandle";
import { RepaymentMade } from "../../user/domain/events/repaymentMade";
import { UpdateLoan } from "../useCases/updateLoan/UpdateLoan";

export class AfterRepaymentMade implements IHandle<RepaymentMade> {
  private updateLoan: UpdateLoan; 

  constructor(updateLoan: UpdateLoan) {
    this.setupSubscriptions();
    this.updateLoan = updateLoan;
  }

  setupSubscriptions(): void {
    DomainEvents.register(this.onRepaymentMade.bind(this), RepaymentMade.name);
  }

  private async onRepaymentMade(event: RepaymentMade): Promise<void> {
    try {
      await this.updateLoan.execute(event);
      console.log(`[AfterRepaymentMade]: Successfully executed updateLoan usecase.`);
    } catch (err) {
      console.log(`[AfterRepaymentMade]: Failed to execute updateLoan usecase.`);
    }
  }
}

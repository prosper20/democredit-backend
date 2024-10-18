import { DomainEvents } from "../../../shared/domain/events/DomainEvents";
import { IHandle } from "../../../shared/domain/events/IHandle";
import { UserCreated } from "../domain/events/userCreated";
import { CreateWallet } from "../useCases/createWallet/CreateWallet";

export class AfterUserCreated implements IHandle<UserCreated> {
  private createWallet: CreateWallet;

  constructor(createWallet: CreateWallet) {
    this.setupSubscriptions();
    this.createWallet = createWallet;
  }

  setupSubscriptions(): void {
    // Register to the domain event
    DomainEvents.register(this.onUserCreated.bind(this), UserCreated.name);
  }

  private async onUserCreated(event: UserCreated): Promise<void> {
    try {
      await this.createWallet.execute(event);
      console.log(`[AfterUserCreated]: Successfully executed createWallet usecase.`);
    } catch (err) {
      console.log(`[AfterUserCreated]: Failed to execute createWallet usecase.`);
    }
  }
}

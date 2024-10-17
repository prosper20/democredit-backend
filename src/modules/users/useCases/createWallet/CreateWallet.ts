import { UniqueEntityID, UseCase } from "../../../../shared";
import { User } from "../../domain/user";
import { Wallet } from "../../domain/wallet";
import { IWalletRepo } from "../../repos/IRepo";

interface Event {
  dateTimeOccurred: Date;
  user: User;
  getAggregateId(): UniqueEntityID;
}

export class CreateWallet implements UseCase<Event, Promise<void>> {
  private walletRepo: IWalletRepo;

  constructor(walletRepo: IWalletRepo) {
    this.walletRepo = walletRepo;
  }

  public async execute(event: Event): Promise<void> {
    let user = event.user;
    
    const walletOrError = Wallet.create({
        userId: event.user.id,
        balance: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

    if (walletOrError.isFailure) {
      console.log(walletOrError.getErrorValue());
      return;
    }

    const wallet = walletOrError.getValue();

    await this.walletRepo.createWallet(wallet);

    return;
  }
}
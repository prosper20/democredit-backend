import { Guard } from "../../../shared/core/Guard";
import { Result } from "../../../shared/core/Result";
import { Entity } from "../../../shared/domain/Entity";
import { UniqueEntityID } from "../../../shared/domain/UniqueEntityID";


export interface WalletProps {
  userId: UniqueEntityID;
  balance: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Wallet extends Entity<WalletProps> {
  get walletId() {
    return this._id;
  }
  get balance() {
    return this.props.balance;
  }
  get userId() {
    return this.props.userId;
  }
  get createdAt() {
    return this.props.createdAt;
  }
  get updatedAt() {
    return this.props.updatedAt;
  }

  private constructor(props: WalletProps, id?: UniqueEntityID) {
    super(props, id);
  }

  public static create(props: WalletProps, id?: UniqueEntityID): Result<Wallet> {
    const nullGuard = Guard.againstNullOrUndefinedBulk([
      { argument: props.userId, argumentName: "userId" },
      { argument: props.balance, argumentName: "balance" },
    ]);

    if (nullGuard.isFailure) {
      return Result.fail<Wallet>(nullGuard.getErrorValue());
    } else {

      const wallet = new Wallet(
        {
          ...props,
        },
        id,
      );

      return Result.ok<Wallet>(wallet);
    }
  }
}
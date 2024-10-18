import { Mapper } from "../../../shared/utils/Mapper";
import { Wallet } from "../domain/wallet";
import { UniqueEntityID } from "../../../shared/domain/UniqueEntityID";

export class WalletMap implements Mapper<Wallet> {
  public static toDTO(wallet: Wallet): any {
    return {
      walletId: wallet.walletId.toString(),
      balance: wallet.balance,
      userId: wallet.userId.toString(),
      createdAt: wallet.createdAt.toISOString(),
      updatedAt: wallet.updatedAt ? wallet.updatedAt.toISOString() : null,
    };
  }

  public static toDomain(raw: any): Wallet {
    const walletOrError = Wallet.create(
      {
        userId: new UniqueEntityID(raw.user_id),
        balance: parseFloat(raw.balance),
        createdAt: new Date(raw.created_at),
        updatedAt: raw.updated_at ? new Date(raw.updated_at) : undefined,
      },
      new UniqueEntityID(raw.id)
    );

    if (walletOrError.isFailure) {
      console.log(walletOrError.getErrorValue());
      return null;
    }

    return walletOrError.getValue();
  }

  public static async toPersistence(wallet: Wallet): Promise<any> {
    return {
      id: wallet.walletId.toString(),
      user_id: wallet.userId.toString(),
      balance: wallet.balance,
      created_at: wallet.createdAt,
      updated_at: wallet.updatedAt ? wallet.updatedAt : null,
    };
  }
}

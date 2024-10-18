import { AppError, Either, left, Result, right, UseCase } from "../../../../shared";
import { Wallet } from "../../domain/wallet";
import { IWalletRepo } from "../../repos/IRepo";
import { ViewWalletRequestDTO } from "./ViewWalletDTO";

type Response = Either<
| AppError.UnexpectedError, Result<Wallet>>;

export class ViewWallet implements UseCase<ViewWalletRequestDTO, Promise<Response>> {
  private walletRepo: IWalletRepo;

  constructor(walletRepo: IWalletRepo) {
    this.walletRepo = walletRepo;
  }

  public async execute(req: ViewWalletRequestDTO): Promise<Response> {

    try {
      const wallet = await this.walletRepo.getWallet(req.userId);
      return right(Result.ok<Wallet>(wallet));
    } catch (err) {
      return left(new AppError.UnexpectedError(err)) as Response;
    }
  }
}

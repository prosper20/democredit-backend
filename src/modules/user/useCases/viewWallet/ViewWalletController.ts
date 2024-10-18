import { DecodedExpressRequest } from "../../../../shared";
import { BaseController } from "../../../../shared/http/models/BaseController";
import { WalletDTO } from "../../dtos/walletDTO";
import { WalletMap } from "../../mappers/walletMap";
import { ViewWallet } from "./ViewWallet";
import { ViewWalletRequestDTO } from "./ViewWalletDTO";

export class ViewWalletController extends BaseController {
  private useCase: ViewWallet;

  constructor(useCase: ViewWallet) {
    super();
    this.useCase = useCase;
  }

  async executeImpl(req: DecodedExpressRequest, res: any): Promise<any> {
    const dto: ViewWalletRequestDTO = {
      userId: req.decoded.userId
    }
    
    try {
      const result = await this.useCase.execute(dto);

      if (result.isLeft()) {
        const error = result.value;

        switch (error.constructor) {
          default:
            return this.fail(res, error.getErrorValue().message);
        }
      } else {
        const value = result.value.getValue();
        const wallet = WalletMap.toDTO(value)
        return this.ok<WalletDTO>(res, wallet);
      }
    } catch (err) {
      return this.fail(res, err);
    }
  }
}

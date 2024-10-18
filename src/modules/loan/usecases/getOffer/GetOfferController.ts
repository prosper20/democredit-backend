import { DecodedExpressRequest } from "../../../../shared";
import { BaseController } from "../../../../shared/http/models/BaseController";
import { LoanOfferDTO } from "../../dtos/loanOfferDTO";
import { LoanOfferMap } from "../../Mappers/loanOfferMap";
import { GetOffer } from "./GetOffer";
import { GetOfferRequestDTO } from "./GetOfferDTO";
import { GetLoanOfferErrors } from "./GetOfferErrors";

export class GetOfferController extends BaseController {
  private useCase: GetOffer;

  constructor(useCase: GetOffer) {
    super();
    this.useCase = useCase;
  }

  async executeImpl(req: DecodedExpressRequest, res: any): Promise<any> {

    const dto: GetOfferRequestDTO = {
      offerId: req.params.offerId as string
    }
    

    try {
      const result = await this.useCase.execute(dto);

      if (result.isLeft()) {
        const error = result.value;

        switch (error.constructor) {
          case GetLoanOfferErrors.OfferNotFoundError:
            return this.fail(res, error.getErrorValue().message);
          default:
            return this.fail(res, error.getErrorValue().message);
        }
      } else {
        const loanOffer = result.value.getValue();
        const offer = LoanOfferMap.toDTO(loanOffer)
        return this.ok<LoanOfferDTO>(res, offer);
      }
    } catch (err) {
      return this.fail(res, err);
    }
  }
}

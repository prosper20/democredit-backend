import { DecodedExpressRequest } from "../../../../shared";
import { BaseController } from "../../../../shared/http/models/BaseController";
import { LoanOfferMap } from "../../mappers/loanOfferMap";
import { GetOffers } from "./GetOffers";
import { GetOffersRequestDTO, GetOffersResponseDTO } from "./GetOffersDTO";
import { paginate } from "../../../../shared/utils/Paginate"

export class GetOffersController extends BaseController {
  private useCase: GetOffers;

  constructor(useCase: GetOffers) {
    super();
    this.useCase = useCase;
  }

  async executeImpl(req: DecodedExpressRequest, res: any): Promise<any> {
    const { page = 1, limit = 10 } = req.query;
    const parsedPage = parseInt(page as string, 10);
    const parsedLimit = parseInt(limit as string, 10);

    const dto: GetOffersRequestDTO = {
      page: parsedPage,
      limit: parsedLimit,
    };
    

    try {
      const result = await this.useCase.execute(dto);

      if (result.isLeft()) {
        const error = result.value;

        switch (error.constructor) {
          default:
            return this.fail(res, error.getErrorValue().message);
        }
      } else {
        const { loanOffers, total } = result.value.getValue();
        const pagination = await  paginate(total, dto.page, dto.limit)
        return this.ok<GetOffersResponseDTO>(res, {
          ...pagination,
          loanOffers: loanOffers.map((offer) => LoanOfferMap.toDTO(offer)),
        });
      }
    } catch (err) {
      return this.fail(res, err);
    }
  }
}

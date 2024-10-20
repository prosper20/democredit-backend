import { DecodedExpressRequest } from "../../../../shared";
import { BaseController } from "../../../../shared/http/models/BaseController";
import { LoanMap } from "../../mappers/loanMap";
import { GetLoans } from "./GetLoans";
import { GetLoansRequestDTO, GetLoansResponseDTO } from "./GetLoansDTO";
import { paginate } from "../../../../shared/utils/Paginate"

export class GetLoansController extends BaseController {
  private useCase: GetLoans;

  constructor(useCase: GetLoans) {
    super();
    this.useCase = useCase;
  }

  async executeImpl(req: DecodedExpressRequest, res: any): Promise<any> {
    const { page = 1, limit = 10 } = req.query;
    const parsedPage = parseInt(page as string, 10);
    const parsedLimit = parseInt(limit as string, 10);
    const status = req.query.status as string || "ALL"

    const dto: GetLoansRequestDTO = {
      userId: req.decoded.userId,
      role: req.decoded.role,
      page: parsedPage,
      limit: parsedLimit,
      status
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
        const { loans, total } = result.value.getValue();
        const pagination = await  paginate(total, dto.page, dto.limit)
        return this.ok<GetLoansResponseDTO>(res, {
          ...pagination,
          loans: loans.map((loan) => LoanMap.toDTO(loan)),
        });
      }
    } catch (err) {
      return this.fail(res, err);
    }
  }
}

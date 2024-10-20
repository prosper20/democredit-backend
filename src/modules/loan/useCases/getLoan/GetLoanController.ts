import { DecodedExpressRequest } from "../../../../shared";
import { BaseController } from "../../../../shared/http/models/BaseController";
import { LoanDTO } from "../../dtos/loanDTO";
import { LoanMap } from "../../mappers/loanMap";
import { GetLoan } from "./GetLoan";
import { GetLoanRequestDTO } from "./GetLoanDTO";
import { GetLoanErrors } from "./GetLoanErrors";

export class GetLoanController extends BaseController {
  private useCase: GetLoan;

  constructor(useCase: GetLoan) {
    super();
    this.useCase = useCase;
  }

  async executeImpl(req: DecodedExpressRequest, res: any): Promise<any> {
    const dto: GetLoanRequestDTO = {
      loanId: req.params.loanId
    }
    
    try {
      const result = await this.useCase.execute(dto);

      if (result.isLeft()) {
        const error = result.value;

        switch (error.constructor) {
          case GetLoanErrors.NotFoundError:
            return this.fail(res, error.getErrorValue().message);
          default:
            return this.fail(res, error.getErrorValue().message);
        }
      } else {
        const value = result.value.getValue();
        const loan = LoanMap.toDTO(value)
        return this.ok<LoanDTO>(res, loan);
      }
    } catch (err) {
      return this.fail(res, err);
    }
  }
}

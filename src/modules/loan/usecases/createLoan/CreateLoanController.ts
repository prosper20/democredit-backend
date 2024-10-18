import * as express from "express";

import { DecodedExpressRequest } from "../../../../shared";
import { BaseController } from "../../../../shared/http/models/BaseController";
import { LoanDTO } from "../../dtos/loanDTO";
import { LoanMap } from "../../Mappers/loanMap";
import { CreateLoanDTO } from "./CreateLoanDTO";
import { CreateLoanErrors } from "./CreateLoanErrors";
import { CreateLoanUseCase } from "./CreateLoanUseCase";

export class CreateLoanController extends BaseController {
  private useCase: CreateLoanUseCase;

  constructor(useCase: CreateLoanUseCase) {
    super();
    this.useCase = useCase;
  }

  async executeImpl(req: DecodedExpressRequest, res: express.Response): Promise<any> {
    const dto: CreateLoanDTO = req.body as CreateLoanDTO;
    dto.userId = req.decoded.userId;
    if(!dto.amount) return this.fail(res, "amount is required")
    if(!dto.duration) return this.fail(res, "duration is required")
    if(!dto.offerId) return this.fail(res, "offerId is required")

    try {
      const result = await this.useCase.execute(dto);

      if (result.isRight()) {
        const loan = result.value.getValue();
        return this.ok(res, LoanMap.toDTO(loan));
      } else {
        const error = result.value;

        switch (error.constructor) {
          case CreateLoanErrors.OfferNotFoundError:
            return this.fail(res, error.getErrorValue().message);
          case CreateLoanErrors.UserNotFound:
            return this.fail(res, error.getErrorValue().message);
          case CreateLoanErrors.ValidationError:
            return this.conflict(res, error.getErrorValue().message);
          default:
            console.log(error);
            return this.fail(res, error.getErrorValue().message);
        }
      }
    } catch (err) {
      return this.fail(res, err as Error);
    }
  }
}

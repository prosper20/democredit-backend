import * as express from "express";

import { DecodedExpressRequest } from "../../../../shared";
import { BaseController } from "../../../../shared/http/models/BaseController";
import { CreateLoanOfferDTO } from "./CreateLoanOfferDTO";
import { CreateLoanOfferErrors } from "./CreateLoanOfferErrors";
import { CreateLoanOfferUseCase } from "./CreateLoanOfferUseCase";

export class CreateLoanOfferController extends BaseController {
  private useCase: CreateLoanOfferUseCase;

  constructor(useCase: CreateLoanOfferUseCase) {
    super();
    this.useCase = useCase;
  }

  async executeImpl(req: DecodedExpressRequest, res: express.Response): Promise<any> {
    let dto: CreateLoanOfferDTO = req.body as CreateLoanOfferDTO;
    dto.userId = req.decoded.userId;

    try {
      const result = await this.useCase.execute(dto);

      if (result.isRight()) {
        return this.ok(res);
      } else {
        const error = result.value;

        switch (error.constructor) {
          case CreateLoanOfferErrors.UserNotFound:
            return this.fail(res, error.getErrorValue().message);
          case CreateLoanOfferErrors.ValidationError:
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

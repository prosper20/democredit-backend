import * as express from "express";

import { DecodedExpressRequest } from "../../../../shared";
import { BaseController } from "../../../../shared/http/models/BaseController";
import { ApproveRejectDTO } from "./ApproveRejectDTO";
import { ApproveRejectErrors } from "./ApproveRejectErrors";
import { ApproveReject } from "./ApproveReject";

export class ApproveRejectController extends BaseController {
  private useCase: ApproveReject;

  constructor(useCase: ApproveReject) {
    super();
    this.useCase = useCase;
  }

  async executeImpl(req: DecodedExpressRequest, res: express.Response): Promise<any> {
    let dto: ApproveRejectDTO = {
      loanId:req.params.loanId,
      type: "REJECTED"
    };
    if (req.path.includes("/approve")) dto.type = "ACTIVE";
    try {
      const result = await this.useCase.execute(dto);

      if (result.isRight()) {
        return this.ok(res);
      } else {
        const error = result.value;

        switch (error.constructor) {
          case ApproveRejectErrors.LoanNotFoundError:
            return this.fail(res, error.getErrorValue().message);
          case ApproveRejectErrors.UserNotFound:
            return this.fail(res, error.getErrorValue().message);
          case ApproveRejectErrors.ValidationError:
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

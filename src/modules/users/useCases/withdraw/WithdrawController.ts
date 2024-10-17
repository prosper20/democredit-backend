import * as express from "express";
import { BaseController } from "../../../../shared/http/models/BaseController";
import { DecodedExpressRequest } from "../../../../shared";
import { WithdrawUseCase } from './WithdrawUseCase';
import { WithdrawRequestDTO, WithdrawResponseDTO } from './WithdrawDTO';
import { WithdrawErrors } from './WithdrawErrors';

export class WithdrawController extends BaseController {
  constructor(private readonly useCase: WithdrawUseCase) {
    super();
  }

  async executeImpl(
    req: DecodedExpressRequest,
    res: express.Response
  ): Promise<any> {
    const dto = req.body as WithdrawRequestDTO;

    if (!dto.amount) return this.fail(res, "amount is required")
    dto.userId = req.decoded.userId;

    try {
      const result = await this.useCase.execute(dto);

      if (result.isRight()) {
        
        const response = result.value.getValue();
        return this.ok<WithdrawResponseDTO>(res, response);
        
      } else {
        const error = result.value;

        switch (error.constructor) {
          case WithdrawErrors.UserNotFoundError:
            return this.fail(res, error.getErrorValue().message);
        case WithdrawErrors.TransactionError:
            return this.fail(res, error.getErrorValue().message);
          default:
            return this.fail(res, error.getErrorValue().message);
        }
      }
    } catch (err) {
      return this.fail(res, err as Error);
    }
  }
}
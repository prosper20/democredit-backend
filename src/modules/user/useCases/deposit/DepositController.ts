import * as express from "express";
import { BaseController } from "../../../../shared/http/models/BaseController";
import { DecodedExpressRequest } from "../../../../shared";
import { DepositUseCase } from './DepositUseCase';
import { DepositRequestDTO, DepositResponseDTO } from './DepositDTO';
import { DepositErrors } from './DepositErrors';

export class DepositController extends BaseController {
  constructor(private readonly useCase: DepositUseCase) {
    super();
  }

  async executeImpl(
    req: DecodedExpressRequest,
    res: express.Response
  ): Promise<any> {
    const dto = req.body as DepositRequestDTO;

    if (!dto.email) return this.fail(res, "email is required")
    if (!dto.amount) return this.fail(res, "amount is required")

    try {
      const result = await this.useCase.execute(dto);

      if (result.isRight()) {
        
        const response = result.value.getValue();
        return this.ok<DepositResponseDTO>(res, response);
        
      } else {
        const error = result.value;

        switch (error.constructor) {
          case DepositErrors.UserNotFoundError:
            return this.fail(res, error.getErrorValue().message);
          case DepositErrors.TransactionError:
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
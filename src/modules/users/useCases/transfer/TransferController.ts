import * as express from "express";
import { BaseController } from "../../../../shared/http/models/BaseController";
import { DecodedExpressRequest } from "../../../../shared";
import { TransferUseCase } from './TransferUseCase';
import { TransferRequestDTO, TransferResponseDTO } from './TransferDTO';
import { TransferErrors } from './TransferErrors';

export class TransferController extends BaseController {
  constructor(private readonly useCase: TransferUseCase) {
    super();
  }

  async executeImpl(
    req: DecodedExpressRequest,
    res: express.Response
  ): Promise<any> {
    const dto = req.body as TransferRequestDTO;
    dto.senderId = req.decoded.userId;

    if (!dto.receiverId) return this.fail(res, "receiverId is required")
    if (!dto.amount) return this.fail(res, "amount is required")
    if (!dto.type) return this.fail(res, "tranfer type is required")

    try {
      const result = await this.useCase.execute(dto);

      if (result.isRight()) {
        
        const response = result.value.getValue();
        return this.ok<TransferResponseDTO>(res, response);
        
      } else {
        const error = result.value;

        switch (error.constructor) {
          case TransferErrors.CannotTransferToSelfError:
            return this.conflict(res, error.getErrorValue().message);
          case TransferErrors.ReceiverNotFoundError:
            return this.fail(res, error.getErrorValue().message);
        case TransferErrors.NoLoanIdError:
            return this.fail(res, error.getErrorValue().message);
          case TransferErrors.TransferError:
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
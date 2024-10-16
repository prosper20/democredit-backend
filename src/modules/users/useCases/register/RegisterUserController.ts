import * as express from "express";

import { DecodedExpressRequest } from "../../../../shared";
import { BaseController } from "../../../../shared/http/models/BaseController";
import { RegisterUserDTO } from "./RegisterUserDTO";
import { RegisterUserErrors } from "./RegisterUserErrors";
import { RegisterUserUseCase } from "./RegisterUserUseCase";

export class RegisterUserController extends BaseController {
  private useCase: RegisterUserUseCase;

  constructor(useCase: RegisterUserUseCase) {
    super();
    this.useCase = useCase;
  }

  async executeImpl(req: DecodedExpressRequest, res: express.Response): Promise<any> {
    let dto: RegisterUserDTO = req.body as RegisterUserDTO;
    dto.role = req.body.role || "USER";

    try {
      const result = await this.useCase.execute(dto);

      if (result.isLeft()) {
        const error = result.value;

        switch (error.constructor) {
          case RegisterUserErrors.EmailAlreadyExistsError:
            return this.conflict(res, error.getErrorValue().message);
          case RegisterUserErrors.PasswordMismatchError:
            return this.conflict(res, error.getErrorValue().message);
          case RegisterUserErrors.UserBlacklistedError:
            return this.fail(res, error.getErrorValue().message);
          case RegisterUserErrors.ValidationError:
            return this.fail(res, error.getErrorValue().message);
          default:
            console.log("Result Error: ", error);
            return this.fail(res, error.getErrorValue().message);
        }
      } else {
        return this.ok(res);
      }
    } catch (err) {
      return this.fail(res, err as Error);
    }
  }
}

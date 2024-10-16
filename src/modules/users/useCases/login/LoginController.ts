import * as express from "express";

import { DecodedExpressRequest } from "../../../../shared";
import { BaseController } from "../../../../shared/http/models/BaseController";
import { LoginDTO, LoginResponse } from "./LoginDTO";
import { LoginUseCaseErrors } from "./LoginErrors";
import { LoginUserUseCase } from "./LoginUseCase";

export class LoginController extends BaseController {
  private useCase: LoginUserUseCase;

  constructor(useCase: LoginUserUseCase) {
    super();
    this.useCase = useCase;
  }

  async executeImpl(req: DecodedExpressRequest, res: express.Response): Promise<any> {
    const dto: LoginDTO = req.body as LoginDTO;

    try {
      const result = await this.useCase.execute(dto);

      if (result.isLeft()) {
        const error = result.value;

        switch (error.constructor) {
          case LoginUseCaseErrors.EmailDoesntExistError:
            return this.notFound(res, error.getErrorValue().message);
          case LoginUseCaseErrors.IncorrectPasswordError:
            return this.clientError(res, error.getErrorValue().message);
          default:
            return this.fail(res, error.getErrorValue().message);
        }
      } else {
        const dto: LoginResponse = result.value.getValue() as LoginResponse;

        return this.ok<LoginResponse>(res, dto);
      }
    } catch (err) {
      return this.fail(res, err as Error);
    }
  }
}

import { userRepo } from "../../repos";
import { RegisterUserController } from "./RegisterUserController";
import { RegisterUserUseCase } from "./RegisterUserUseCase";

const registerUserUsecase = new RegisterUserUseCase(userRepo);
const registerUserController = new RegisterUserController(registerUserUsecase);

export { registerUserController, registerUserUsecase };

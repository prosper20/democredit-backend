import { userRepo } from "../../repos";
import { authService } from "../../services";
import { LoginController } from "./LoginController";
import { LoginUserUseCase } from "./LoginUseCase";

const loginUseCase = new LoginUserUseCase(userRepo, authService);
const loginController = new LoginController(loginUseCase);

export { loginController };

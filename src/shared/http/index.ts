import { authService } from "../../../modules/users/services";
import { Middleware } from "./utils/Middleware";

const middleware = new Middleware(authService);

export { middleware };

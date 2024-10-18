import { authService } from "../../modules/user/services";
import { Middleware } from "./utils/Middleware";

const middleware = new Middleware(authService);

export { middleware };

import "./modules/users/subscriptions";

import { userRouter } from "./modules/users/infra/http/routes";
import { config } from "./shared/config";
import { WebServer } from "./shared/http/webServer";


new WebServer(config.api, [userRouter]).start();
import "./modules/user/subscriptions";
import "./modules/loan/subscriptions";

import { userRouter } from "./modules/user/infra/http/routes";
import { config } from "./shared/config";
import { WebServer } from "./shared/http/webServer";
import { loanRouter } from "./modules/loan/infra/http/routes";


new WebServer(config.api, [userRouter, loanRouter]).start();
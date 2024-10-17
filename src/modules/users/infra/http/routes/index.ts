import express from "express";
import { loginController } from "../../../useCases/login";
import { registerUserController } from "../../../useCases/register";
import { middleware } from "../../../../../shared/http";
import { transferController } from "../../../useCases/transfer";
import { depositController } from "../../../useCases/deposit";
import { withdrawController } from "../../../useCases/withdraw";

const userRouter = express.Router();

userRouter.get("/", (req, res) => {
  res.send("Hello DemoCredit");
});

//Authenication endpoints
userRouter.post("/auth/register", (req, res) => registerUserController.execute(req, res));

userRouter.post("/auth/login", (req, res) => loginController.execute(req, res));

//transaction endpoints
userRouter.post("/wallets/deposit", (req, res) => depositController.execute(req, res));
userRouter.post("/wallets/withdraw", middleware.ensureAuthenticated(), (req, res) => withdrawController.execute(req, res));
userRouter.post("/wallets/transfer", middleware.ensureAuthenticated(), (req, res) => transferController.execute(req, res));

export { userRouter };

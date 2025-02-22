import express from "express";
import { loginController } from "../../../useCases/login";
import { registerUserController } from "../../../useCases/register";
import { middleware } from "../../../../../shared/http";
import { transferController } from "../../../useCases/transfer";
import { depositController } from "../../../useCases/deposit";
import { withdrawController } from "../../../useCases/withdraw";
import { getTransactionsController } from "../../../useCases/getTransactions";
import { viewWalletController } from "../../../useCases/viewWallet";

const userRouter = express.Router({ mergeParams: true });

userRouter.get("/", (req, res) => {
  res.send("Hello DemoCredit");
});

//Authenication endpoints
userRouter.post("/auth/register", (req, res) => registerUserController.execute(req, res));

userRouter.post("/auth/login", (req, res) => loginController.execute(req, res));

//wallet endpoints
userRouter.get("/wallet", middleware.ensureAuthenticated(), (req, res) => viewWalletController.execute(req, res));
userRouter.post("/wallet/deposit", (req, res) => depositController.execute(req, res));
userRouter.post("/wallet/withdraw", middleware.ensureAuthenticated(), (req, res) => withdrawController.execute(req, res));
userRouter.post("/wallet/transfer", middleware.ensureAuthenticated(), (req, res) => transferController.execute(req, res));

//transaction endpoints
userRouter.get("/transactions", middleware.ensureAuthenticated(), (req, res) => getTransactionsController.execute(req, res));

export { userRouter };

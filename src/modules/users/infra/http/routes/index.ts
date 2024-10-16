import express from "express";
import { loginController } from "../../../useCases/login";
import { registerUserController } from "../../../useCases/register";

const userRouter = express.Router();

userRouter.get("/", (req, res) => {
  res.send("Hello DemoCredit");
});

//Authenication endpoints
userRouter.post("/auth/register", (req, res) => registerUserController.execute(req, res));

userRouter.post("/auth/login", (req, res) => loginController.execute(req, res));

export { userRouter };

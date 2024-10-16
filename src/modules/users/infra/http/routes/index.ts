import express from "express";

const userRouter = express.Router();

userRouter.get("/", (req, res) => {
  res.send("Hello DemoCredit");
});

export { userRouter };

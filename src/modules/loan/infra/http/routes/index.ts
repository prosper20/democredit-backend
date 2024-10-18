import express from "express";

import { middleware } from "../../../../../shared/http";
import { createLoanOfferController } from "../../../usecases/createLoanOffer";
import { createLoanController } from "../../../usecases/createLoan";
const loanRouter = express.Router();

loanRouter.post("/loans/offers", 
  middleware.ensureAuthenticated(), 
  middleware.restrictTo("ADMIN"), 
  (req, res) => createLoanOfferController.execute(req, res)
);

loanRouter.post("/loans/request", 
  middleware.ensureAuthenticated(), 
  middleware.restrictTo("USER"), 
  (req, res) => createLoanController.execute(req, res)
);

export { loanRouter };

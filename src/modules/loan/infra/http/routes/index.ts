import express from "express";

import { middleware } from "../../../../../shared/http";
import { createLoanOfferController } from "../../../usecases/createLoanOffer";
const loanRouter = express.Router();

// loanRouter.get("/loans/offers", (req, res) => getLoanOffersController.execute(req, res));

loanRouter.post("/loans/offers", 
  middleware.ensureAuthenticated(), 
  middleware.restrictTo("ADMIN"), 
  (req, res) => createLoanOfferController.execute(req, res)
);

// loanRouter.post("/loans/request", 
//   middleware.ensureAuthenticated(), 
//   (req, res) => createLoanController.execute(req, res)
// );

// loanRouter.post("/loans/approve", 
//   middleware.ensureAuthenticated(), 
//   (req, res) => approveLoanController.execute(req, res)
// );

// loanRouter.post("/loans/reject", 
//   middleware.ensureAuthenticated(), 
//   (req, res) => rejectLoanController.execute(req, res)
// );
export { loanRouter };

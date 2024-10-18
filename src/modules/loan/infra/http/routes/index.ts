import express from "express";

import { middleware } from "../../../../../shared/http";
import { createLoanOfferController } from "../../../usecases/createLoanOffer";
import { createLoanController } from "../../../usecases/createLoan";
import { getOffersController } from "../../../usecases/getOffers";
import { getLoansController } from "../../../usecases/getLoans";
const loanRouter = express.Router();

loanRouter.get("/loans", 
  middleware.ensureAuthenticated(),  
  (req, res) => getLoansController.execute(req, res)
);

loanRouter.get("/loans/offers", (req, res) => getOffersController.execute(req, res));

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

// loanRouter.post("/loans/approve", 
//   middleware.ensureAuthenticated(), 
//   (req, res) => approveLoanController.execute(req, res)
// );

// loanRouter.post("/loans/reject", 
//   middleware.ensureAuthenticated(), 
//   (req, res) => rejectLoanController.execute(req, res)
// );
export { loanRouter };

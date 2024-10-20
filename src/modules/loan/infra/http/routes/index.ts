import express from "express";

import { middleware } from "../../../../../shared/http";
import { createLoanOfferController } from "../../../useCases/createLoanOffer";
import { createLoanController } from "../../../useCases/createLoan";
import { getOffersController } from "../../../useCases/getOffers";
import { getLoansController } from "../../../useCases/getLoans";
import { getOfferController } from "../../../useCases/getOffer";
import { getLoanController } from "../../../useCases/getLoan";
import { userRouter } from "../../../../user/infra/http/routes";
import { getTransactionsController } from "../../../../user/useCases/getTransactions";
import { approveRejectController } from "../../../useCases/approveOrRejectLoan";
const loanRouter = express.Router();

loanRouter.get("/loans", 
  middleware.ensureAuthenticated(),  
  (req, res) => getLoansController.execute(req, res)
);

loanRouter.post("/loans/offers", 
  middleware.ensureAuthenticated(), 
  middleware.restrictTo("ADMIN"), 
  (req, res) => createLoanOfferController.execute(req, res)
);

loanRouter.get("/loans/offers", (req, res) => getOffersController.execute(req, res));

loanRouter.get("/loans/offers/:offerId", (req, res) => getOfferController.execute(req, res)
);

loanRouter.post("/loans/request", 
  middleware.ensureAuthenticated(), 
  middleware.restrictTo("USER"), 
  (req, res) => createLoanController.execute(req, res)
);

loanRouter.get("/loans/:loanId", 
  middleware.ensureAuthenticated(), 
  (req, res) => getLoanController.execute(req, res)
);

loanRouter.post("/loans/:loanId/approve", 
  middleware.ensureAuthenticated(), 
  (req, res) => approveRejectController.execute(req, res)
);

loanRouter.post("/loans/:loanId/reject", 
  middleware.ensureAuthenticated(), 
  (req, res) => approveRejectController.execute(req, res)
);

loanRouter.get("/loans/:loanId/transactions", middleware.ensureAuthenticated(), 
  (req, res) => getTransactionsController.execute(req, res)
);


export { loanRouter };

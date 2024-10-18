import { loanRepo } from "../../repos";
import { GetLoan } from "./GetLoan";
import { GetLoanController } from "./GetLoanController";

const getLoan = new GetLoan(loanRepo);
const getLoanController = new GetLoanController(getLoan);

export { getLoan, getLoanController };

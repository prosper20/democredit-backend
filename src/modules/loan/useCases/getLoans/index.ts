import { loanRepo } from "../../repos";
import { GetLoans } from "./GetLoans";
import { GetLoansController } from "./GetLoansController";

const getLoans = new GetLoans(loanRepo);
const getLoansController = new GetLoansController(getLoans);

export { getLoans, getLoansController };

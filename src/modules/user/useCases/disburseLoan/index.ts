import { transactionRepo } from "../../repos";
import { DisburseLoan } from "./DisburseLoan";

const disburseLoan = new DisburseLoan(transactionRepo);

export { disburseLoan };
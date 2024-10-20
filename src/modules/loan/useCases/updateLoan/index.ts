import { loanRepo } from "../../repos";
import { UpdateLoan } from "./UpdateLoan";

const updateLoan = new UpdateLoan(loanRepo);

export { updateLoan };
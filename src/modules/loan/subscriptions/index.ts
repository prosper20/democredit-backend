import { updateLoan } from "../useCases/updateLoan";
import { AfterRepaymentMade } from "./afterRepaymentMade";

new AfterRepaymentMade(updateLoan);


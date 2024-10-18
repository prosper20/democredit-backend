import { createWallet } from "../useCases/createWallet";
import { disburseLoan } from "../useCases/disburseLoan";
import { AfterLoanApproved } from "./afterLoanApproved";
import { AfterUserCreated } from "./afterUserCreated";

new AfterUserCreated(createWallet);
new AfterLoanApproved(disburseLoan)

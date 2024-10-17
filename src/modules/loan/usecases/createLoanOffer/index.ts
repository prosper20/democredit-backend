import { loanRepo } from "../../repos";
import { CreateLoanOfferController } from "./CreateLoanOfferController";
import { CreateLoanOfferUseCase } from "./CreateLoanOfferUseCase";

const createLoanOfferUseCase = new CreateLoanOfferUseCase(loanRepo);
const createLoanOfferController = new CreateLoanOfferController(createLoanOfferUseCase);

export { createLoanOfferController, createLoanOfferUseCase };

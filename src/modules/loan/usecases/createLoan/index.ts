import { loanRepo } from "../../repos";
import { CreateLoanController } from "./CreateLoanController";
import { CreateLoanUseCase } from "./CreateLoanUseCase";

const createLoanUseCase = new CreateLoanUseCase(loanRepo);
const createLoanController = new CreateLoanController(createLoanUseCase);

export { createLoanController, createLoanUseCase };

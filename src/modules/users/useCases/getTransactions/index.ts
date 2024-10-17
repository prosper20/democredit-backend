import { transactionRepo } from "../../repos";
import { GetTransactions } from "./GetTransactions";
import { GetTransactionsController } from "./GetTransactionsController";

const getTransactions = new GetTransactions(transactionRepo);
const getTransactionsController = new GetTransactionsController(getTransactions);

export { getTransactions, getTransactionsController };

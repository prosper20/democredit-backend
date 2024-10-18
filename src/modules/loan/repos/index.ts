
import { KnexLoanRepo } from "./implementations/knexLoanRepo";
import db from '../../../shared/persistence/knex';

const loanRepo = new KnexLoanRepo(db);

export { loanRepo }

import { KnexUserRepo } from "./implementations/knexUserRepo";
import db from '../../../shared/persistence/knex';
import { KnexTransactionRepo } from "./implementations/knexTransactionRepo";
import { KnexWalletRepo } from "./implementations/walletRepo";

const userRepo = new KnexUserRepo(db);
const walletRepo = new KnexWalletRepo(db);
const transactionRepo = new KnexTransactionRepo(db);

export { userRepo, walletRepo, transactionRepo }
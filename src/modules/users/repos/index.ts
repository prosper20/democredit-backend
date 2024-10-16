
import { KnexUserRepo } from "./implementations/knexUserRepo";
import db from '../../../shared/persistence/knex';

const userRepo = new KnexUserRepo(db);

export { userRepo }
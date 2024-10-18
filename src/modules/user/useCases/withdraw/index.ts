import { transactionRepo, userRepo } from '../../repos';
import { WithdrawController } from './WithdrawController';
import { WithdrawUseCase } from './WithdrawUseCase';

const withdrawUseCase = new WithdrawUseCase(transactionRepo, userRepo);

const withdrawController = new WithdrawController(withdrawUseCase);

export { withdrawController };

import { transactionRepo, userRepo } from '../../repos';
import { DepositController } from './DepositController';
import { DepositUseCase } from './DepositUseCase';

const depositUseCase = new DepositUseCase(transactionRepo, userRepo);

const depositController = new DepositController(depositUseCase);

export { depositController };

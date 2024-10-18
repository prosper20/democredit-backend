import { transactionRepo, userRepo } from '../../repos';
import { TransferController } from './TransferController';
import { TransferUseCase } from './TransferUseCase';

const transferUseCase = new TransferUseCase(transactionRepo, userRepo);
const transferController = new TransferController(transferUseCase);

export { transferController, transferUseCase };

import { walletRepo } from "../../repos";
import { ViewWallet } from "./ViewWallet";
import { ViewWalletController } from "./ViewWalletController";

const viewWallet = new ViewWallet(walletRepo);
const viewWalletController = new ViewWalletController(viewWallet);

export { viewWalletController };

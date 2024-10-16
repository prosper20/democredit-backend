import { walletRepo } from "../../repos";
import { CreateWallet } from "./CreateWallet";

const createWallet = new CreateWallet(walletRepo);

export { createWallet };
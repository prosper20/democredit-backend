import { createWallet } from "../useCases/createWallet";
import { AfterUserCreated } from "./afterUserCreated";

new AfterUserCreated(createWallet);

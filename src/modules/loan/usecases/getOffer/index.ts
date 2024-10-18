import { loanRepo } from "../../repos";
import { GetOffer } from "./GetOffer";
import { GetOfferController } from "./GetOfferController";

const getOffer = new GetOffer(loanRepo);
const getOfferController = new GetOfferController(getOffer);

export { getOffer, getOfferController };

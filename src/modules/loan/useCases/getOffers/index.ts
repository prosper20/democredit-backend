import { loanRepo } from "../../repos";
import { GetOffers } from "./GetOffers";
import { GetOffersController } from "./GetOffersController";

const getOffers = new GetOffers(loanRepo);
const getOffersController = new GetOffersController(getOffers);

export { getOffers, getOffersController };

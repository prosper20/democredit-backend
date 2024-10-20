import { loanRepo } from "../../repos";
import { ApproveRejectController } from "./ApproveRejectController";
import { ApproveReject } from "./ApproveReject";

const approveReject = new ApproveReject(loanRepo);
const approveRejectController = new ApproveRejectController(approveReject);

export { approveRejectController, approveReject };

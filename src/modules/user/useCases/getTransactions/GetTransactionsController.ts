import { DecodedExpressRequest } from "../../../../shared";
import { BaseController } from "../../../../shared/http/models/BaseController";
import { TransactionMap } from "../../mappers/transactionMap";
import { GetTransactions } from "./GetTransactions";
import { GetTransactionsRequestDTO, GetTransactionsResponseDTO } from "./GetTransactionsDTO";
import { paginate } from "../../../../shared/utils/Paginate"

export class GetTransactionsController extends BaseController {
  private useCase: GetTransactions;

  constructor(useCase: GetTransactions) {
    super();
    this.useCase = useCase;
  }

  async executeImpl(req: DecodedExpressRequest, res: any): Promise<any> {
    const { page = 1, limit = 10 } = req.query;
    const parsedPage = parseInt(page as string, 10);
    const parsedLimit = parseInt(limit as string, 10);

    const dto: GetTransactionsRequestDTO = {
      userId: req.decoded.userId,
      page: parsedPage,
      limit: parsedLimit,
    };

    if (req.params.loanId) dto.loanId = req.params.loanId as string;
    
    try {
      const result = await this.useCase.execute(dto);

      if (result.isLeft()) {
        const error = result.value;

        switch (error.constructor) {
          default:
            return this.fail(res, error.getErrorValue().message);
        }
      } else {
        const { transactions, total } = result.value.getValue();
        const pagination = await  paginate(total, dto.page, dto.limit)
        return this.ok<GetTransactionsResponseDTO>(res, {
          ...pagination,
          transactions: transactions.map((tnx) => TransactionMap.toDTO(tnx)),
        });
      }
    } catch (err) {
      return this.fail(res, err);
    }
  }
}

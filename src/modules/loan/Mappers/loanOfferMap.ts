import { Mapper } from "../../../shared/utils/Mapper";
import { LoanOffer } from "../domain/loanOffer";
import { UniqueEntityID } from "../../../shared/domain/UniqueEntityID";
import { LoanOfferDTO } from "../dtos/loanOfferDTO";
import { Wallet } from "../../users/domain/wallet";

export class LoanOfferMap implements Mapper<LoanOffer> {
    public static toDTO(loanOffer: LoanOffer): LoanOfferDTO {
    return {
        offerId: loanOffer.loanOfferId.toString(),
        name: loanOffer.name,
        tenure: loanOffer.tenure,
        maxAmount: loanOffer.maxAmount.toFixed(2),
        interestRate: loanOffer.interestRate.toFixed(2),
        loanerId: loanOffer.loanerId.toString(),
        createdAt: loanOffer.createdAt ? loanOffer.createdAt.toISOString() : new Date().toISOString(),
    };
  }

  public static toDomain(raw: any): LoanOffer {
    const loanOfferOrError = LoanOffer.create(
      {
        name: raw.name,
        tenure: raw.tenure,
        maxAmount: parseFloat(raw.max_amount),
        interestRate: parseFloat(raw.interest_rate),
        loanerId: new UniqueEntityID(raw.loaner_id),
        createdAt: new Date(raw.created_at),
        updatedAt: raw.updated_at ? new Date(raw.updated_at) : undefined,
      },
      new UniqueEntityID(raw.id)
    );

    if (loanOfferOrError.isFailure) {
      console.log(loanOfferOrError.getErrorValue());
      return null; 
    }

    return loanOfferOrError.getValue();
  }

public static async toPersistence(loanOffer: LoanOffer): Promise<any> {
    return {
      id: loanOffer.loanOfferId.toString(),
      name: loanOffer.name,
      tenure: loanOffer.tenure,
      max_amount: loanOffer.maxAmount,
      interest_rate: loanOffer.interestRate,
      loaner_id: loanOffer.loanerId.toString(),
      created_at: loanOffer.createdAt,
      updated_at: loanOffer.updatedAt ? loanOffer.updatedAt : null,
    };
  }
}

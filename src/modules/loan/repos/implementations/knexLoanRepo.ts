import { Knex } from 'knex';
import { LoanOffer } from '../../domain/loanOffer';
import { LoanOfferMap } from '../../Mappers/loanOfferMap';
import { LoanMap } from '../../Mappers/loanMap';
import { ILoanRepo } from '../IRepo';
import { Loan } from '../../domain/loan';

export class KnexLoanRepo implements ILoanRepo {
  private db: Knex<any, unknown[]>;

  constructor(db: Knex<any, unknown[]>) {
    this.db = db;
  }

  async saveLoanOffer(loanOffer: LoanOffer): Promise<void> {
    const exists = await this.db('loan_offers').where({ id: loanOffer.loanOfferId.toString() }).first();
    const rawLoanOffer = await LoanOfferMap.toPersistence(loanOffer);
    
    if (exists) {
      await this.db('loan_offers')
        .where({ id: loanOffer.loanOfferId.toString() })
        .update(rawLoanOffer);
    } else {
      await this.db('loan_offers').insert(rawLoanOffer).returning('*');
    }
  }

  async getLoanOffer(loanOfferId: string): Promise<LoanOffer> {
    const loanOfferData = await this.db('loan_offers').where({ id: loanOfferId }).first();
    
    if (!loanOfferData) throw new Error("Offer not found.");

    return LoanOfferMap.toDomain(loanOfferData);
  }

  async saveLoan(loan: Loan): Promise<void> {
    const exists = await this.db('loans').where({ id: loan.loanId.toString() }).first(); // Assuming loan has an id property
    const rawLoan = await LoanMap.toPersistence(loan);
    
    if (exists) {
      await this.db('loans')
        .where({ id: loan.loanId.toString() })
        .update(rawLoan);
    } else {
      await this.db('loans').insert(rawLoan);
    }
  }
}

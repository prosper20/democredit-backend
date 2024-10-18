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

  async getLoanOffers(page: number = 1, limit: number = 10): Promise<{loanOffers: LoanOffer[], total: number}> {
    const offset = (page - 1) * limit;

    const loanOffersData = await this.db('loan_offers')
      .select('*')
      .limit(limit)
      .offset(offset);

    const totalResult = await this.db('loan_offers')
      .count('* as count')
      .first();

    const total = totalResult ? Number(totalResult.count) : 0;
    const loanOffers = loanOffersData.map((offer) => LoanOfferMap.toDomain(offer));

    return {
      loanOffers,
      total,
    };
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

   async getLoan(loanId: string): Promise<Loan> {
    const loanData = await this.db('loans').where({ id: loanId }).first();
    
    if (!loanData) throw new Error("Loan not found.");

    return LoanMap.toDomain(loanData);
  }

  async getLoansForUser(
  userId: string,
  page: number = 1,
  limit: number = 10,
  status: string = 'ALL'
): Promise<{ loans: Loan[], total: number }> {
  const offset = (page - 1) * limit;

  let query = this.db('loans').where({ user_id: userId });

  if (status !== 'ALL') {
    query = query.andWhere({ status });
  }

  const loansData = await query.limit(limit).offset(offset);

  const totalResult = await this.db('loans')
    .where({ user_id: userId })
    .modify((qb) => {
      if (status !== 'ALL') {
        qb.andWhere({ status });
      }
    })
    .count('* as count')
    .first();

  const total = totalResult ? Number(totalResult.count) : 0;
  const loans = loansData.map((offer) => LoanMap.toDomain(offer));

  return {
    loans,
    total,
  };
 }

 async getLoansForAdmin(
  loanerId: string,
  page: number = 1,
  limit: number = 10,
  status: string = 'ALL'
): Promise<{ loans: Loan[], total: number }> {
  const offset = (page - 1) * limit;

  let query = this.db('loans').where({ loaner_id: loanerId });

  if (status !== 'ALL') {
    query = query.andWhere({ status });
  }

  const loansData = await query.limit(limit).offset(offset);

  const totalResult = await this.db('loans')
    .where({ loaner_id: loanerId })
    .modify((qb) => {
      if (status !== 'ALL') {
        qb.andWhere({ status });
      }
    })
    .count('* as count')
    .first();

  const total = totalResult ? Number(totalResult.count) : 0;
  const loans = loansData.map((offer) => LoanMap.toDomain(offer));

  return {
    loans,
    total,
  };
 }



  // async getLoansForUser(userId: string,page: number = 1, limit: number = 10): Promise<{loans: Loan[], total: number}> {
  //   const offset = (page - 1) * limit;

  //   const loansData = await this.db('loans')
  //     .where({ user_id: userId })
  //     .limit(limit)
  //     .offset(offset);

  //   const totalResult = await this.db('loans')
  //     .where({ user_id: userId })
  //     .count('* as count')
  //     .first();

  //   const total = totalResult ? Number(totalResult.count) : 0;
  //   const loans = loansData.map((offer) => LoanMap.toDomain(offer));

  //   return {
  //     loans,
  //     total,
  //   };
  // }

  // async getLoansForAdmin(loanerId: string,page: number = 1, limit: number = 10): Promise<{loans: Loan[], total: number}> {
  //   const offset = (page - 1) * limit;

  //   const loansData = await this.db('loans')
  //     .where({ loaner_id: loanerId })
  //     .limit(limit)
  //     .offset(offset);

  //   const totalResult = await this.db('loans')
  //     .where({ loaner_id: loanerId })
  //     .count('* as count')
  //     .first();

  //   const total = totalResult ? Number(totalResult.count) : 0;
  //   const loans = loansData.map((offer) => LoanMap.toDomain(offer));

  //   return {
  //     loans,
  //     total,
  //   };
  // }
}

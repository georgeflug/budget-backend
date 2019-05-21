import { RawPlaidModel } from '../db/raw-plaid';
import { PlaidTransaction } from './plaid-types';

export async function saveRawTransactions(transactions: PlaidTransaction[]) {
  const rawPlaid = new RawPlaidModel({
    data: transactions
  });
  return await rawPlaid.save();
};

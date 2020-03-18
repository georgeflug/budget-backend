import {RawPlaidDbModel} from '../../db/raw-plaid';
import {PlaidTransaction} from '../plaid-types';

export async function saveRawTransactions(transactions: PlaidTransaction[]) {
  const rawPlaid = new RawPlaidDbModel({
    data: transactions
  });
  return await rawPlaid.save();
}

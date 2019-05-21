import { RawPlaidModel } from '../db/raw-plaid';

export async function saveRawTransactions(transactions: any) {
  const rawPlaid = new RawPlaidModel({
    data: transactions
  });
  return await rawPlaid.save();
};

import {PlaidTransaction} from "../plaid-types";
import { UnsavedTransactionV2 } from "../../transaction/transaction-model";
import { parseISO } from "date-fns";

const ACCOUNT_MAP = {
  'o3d3dPnELRtY7gEPPaBVsbZkDqJeQLCB680A5': 'Discover',
  'DoQmRxwVbDTw4X5wbBNyTEZ7kDN9ZRfZE880w': 'Checking',
  '1EzgJnaKqxFD8R9D5pdXug0qLPKx0XHmJXXEY': 'Savings'
};

export function adaptTransactions(transactions: PlaidTransaction[]): UnsavedTransactionV2[] {
  return transactions.map(transaction => {
    return {
      totalAmount: transaction.amount,
      account: ACCOUNT_MAP[transaction.account_id],
      postedDate: parseISO(transaction.date),
      postedDescription: transaction.name,
      plaidId: transaction.transaction_id,
      splits: [{
        amount: transaction.amount,
        budget: '',
        description: '',
      }],
      pending: transaction.pending
    };
  });
}

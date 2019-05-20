// temporary code to have typescript recognize this file as a module
export { };

const ACCOUNT_MAP = {
  'o3d3dPnELRtY7gEPPaBVsbZkDqJeQLCB680A5': 'Discover',
  'DoQmRxwVbDTw4X5wbBNyTEZ7kDN9ZRfZE880w': 'Checking',
  '1EzgJnaKqxFD8R9D5pdXug0qLPKx0XHmJXXEY': 'Savings'
};

module.exports = function adaptPlaidTransactionForDb(transactions) {
  return transactions.map(transaction => {
    return {
      date: transaction.date,
      totalAmount: transaction.amount,
      account: ACCOUNT_MAP[transaction.account_id],
      postedDate: transaction.date,
      postedDescription: transaction.name,
      plaidId: transaction.transaction_id,
      splits: [{
        amount: transaction.amount
      }],
      pendingPlaidId: transaction.pending_transaction_id,
    };
  });
};

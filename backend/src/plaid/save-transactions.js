const Transaction = require('../db/transaction');

module.exports = async function saveTransactions(transactions) {
  return await Promise.all(transactions.map(saveTransaction));
};

async function saveTransaction(plaidTransaction) {
  let existingTransaction = await findExistingTransaction(plaidTransaction);
  if (existingTransaction) {
    return updateExistingTransaction(plaidTransaction, existingTransaction);
  } else {
    return await saveNewTransaction(plaidTransaction);
  }
}

async function findExistingTransaction(plaidTransaction) {
  const existingTransaction = await Transaction.model.findOne({ plaidId: plaidTransaction.plaidId }).exec();
  if (existingTransaction) {
    return existingTransaction;
  }
  return await Transaction.model.findOne({ account: null, amount: plaidTransaction.amount }).exec();
}

async function saveNewTransaction(plaidTransaction) {
  return await (new Transaction.model(plaidTransaction)).save();
}

async function updateExistingTransaction(plaidTransaction, existingTransaction) {
  await updateTopLevelData(existingTransaction, plaidTransaction);
  return await updateSplits(existingTransaction, plaidTransaction);
}

async function updateTopLevelData(existingTransaction, plaidTransaction) {
  existingTransaction.postedDate = plaidTransaction.postedDate;
  existingTransaction.postedDescription = plaidTransaction.postedDescription;
  existingTransaction.account = plaidTransaction.account;
  existingTransaction.plaidId = plaidTransaction.plaidId;
  existingTransaction.totalAmount = plaidTransaction.totalAmount;
  // save fields
  return await existingTransaction.save();
}

async function updateSplits(existingTransaction, plaidTransaction) {
  await removeUncategorizedSplits(existingTransaction);
  return await addSplitToEnsureTotalSum(existingTransaction, plaidTransaction.totalAmount);
}

async function removeUncategorizedSplits(existingTransaction) {
  for (let i = 0; i < existingTransaction.splits.length; i++) {
    if (!existingTransaction.splits[i].budget) {
      existingTransaction.splits[i].remove();
      i--;
    }
  }
  return await existingTransaction.save();
}

async function addSplitToEnsureTotalSum(existingTransaction, newTotal) {
  const splitTotal = existingTransaction.splits.reduce((accumulated, split) => accumulated + split.amount, 0);
  if (splitTotal !== newTotal) {
    existingTransaction.splits.push({
      amount: newTotal - splitTotal
    });
  }
  return await existingTransaction.save();
}

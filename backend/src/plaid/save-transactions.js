const Transaction = require('../db/transaction');
const moment = require('moment');

module.exports = async function saveTransactions(transactions) {
  const results = await Promise.all(transactions.map(saveTransaction));
  const existingCount = results.reduce((total, current) => total + (current.type === 'updated' ? 1 : 0), 0);
  const unchangedCount = results.reduce((total, current) => total + (current.type === 'unchanged' ? 1 : 0), 0);
  const totalCount = transactions.length;
  const newRecords = totalCount - existingCount - unchangedCount;

  return {
    newRecords: newRecords,
    updatedRecords: existingCount,
    unchangedRecords: unchangedCount,
    totalRecords: totalCount
  };
};

async function saveTransaction(plaidTransaction) {
  let existingTransaction = await findExistingTransaction(plaidTransaction);
  if (existingTransaction) {
    if (isTransactionTheSame(plaidTransaction, existingTransaction)) {
      return {
        type: 'unchanged',
        transaction: existingTransaction
      };
    } else {
      return {
        type: 'updated',
        transaction: await updateExistingTransaction(plaidTransaction, existingTransaction)
      };
    }
  } else {
    return {
      type: 'new',
      transaction: await saveNewTransaction(plaidTransaction)
    };
  }
}

function isTransactionTheSame(plaidTransaction, existingTransaction) {
  return (
    existingTransaction.postedDescription === plaidTransaction.postedDescription &&
    existingTransaction.plaidId === plaidTransaction.plaidId &&
    existingTransaction.account === plaidTransaction.account &&
    existingTransaction.totalAmount === plaidTransaction.totalAmount &&
    moment(existingTransaction.postedDate).isSame(plaidTransaction.postedDate)
  );
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

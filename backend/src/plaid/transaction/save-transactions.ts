import {TransactionDbModel} from '../../db/transaction';

const moment = require('moment');

export async function saveTransactions(transactions) {
  const results = await Promise.all(transactions
      .filter(t => !t.pending)
      .map(saveTransaction)
  );
  const existingCount = results.reduce((total: any, current: any) => total + (current.type === 'updated' ? 1 : 0), 0) as number;
  const unchangedCount = results.reduce((total: any, current: any) => total + (current.type === 'unchanged' ? 1 : 0), 0) as number;
  const totalCount = transactions.length;
  const newRecords = totalCount - existingCount - unchangedCount;

  return {
    newRecords: newRecords,
    updatedRecords: existingCount,
    unchangedRecords: unchangedCount,
    totalRecords: totalCount
  };
}

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
  const existingTransaction = await TransactionDbModel.findOne({plaidId: plaidTransaction.plaidId}).exec();
  if (existingTransaction) {
    return existingTransaction;
  }
  if (plaidTransaction.pendingPlaidId) {
    const pendingTransaction = await TransactionDbModel.findOne({plaidId: plaidTransaction.pendingPlaidId}).exec();
    if (pendingTransaction) {
      return pendingTransaction;
    }
  }
  const replacedTransaction = await TransactionDbModel.findOne({
    pending: true,
    totalAmount: plaidTransaction.totalAmount,
    postedDate: plaidTransaction.postedDate,
    account: plaidTransaction.account
  }).exec();
  if (replacedTransaction) {
    return replacedTransaction;
  }
  const similarTransaction = await TransactionDbModel.findOne({account: null, totalAmount: plaidTransaction.totalAmount}).exec();
  if (similarTransaction) {
    if (Math.abs(moment(similarTransaction.date).diff(moment(plaidTransaction.postedDate), 'days')) <= 10) {
      return similarTransaction;
    }
  }
  return null;
}

async function saveNewTransaction(plaidTransaction) {
  return await (new TransactionDbModel(plaidTransaction)).save();
}

async function updateExistingTransaction(plaidTransaction, existingTransaction) {
  await updateTopLevelData(existingTransaction, plaidTransaction);
  return await updateSplits(existingTransaction, plaidTransaction);
}

async function updateTopLevelData(existingTransaction, plaidTransaction) {
  existingTransaction.postedDate = plaidTransaction.postedDate;
  if (existingTransaction.postedDescription && existingTransaction.plaidId != plaidTransaction.plaidId) {
    existingTransaction.postedDescription = plaidTransaction.postedDescription + ` (${existingTransaction.postedDescription})`;
  } else {
    existingTransaction.postedDescription = plaidTransaction.postedDescription;
  }
  existingTransaction.account = plaidTransaction.account;
  existingTransaction.plaidId = plaidTransaction.plaidId;
  existingTransaction.totalAmount = plaidTransaction.totalAmount;
  existingTransaction.pending = plaidTransaction.pending;
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

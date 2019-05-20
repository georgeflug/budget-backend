// temporary code to have typescript recognize this file as a module
export { };

const expect = require('chai').expect;
const db = require('../db/db');
const saveTransactions = require('./save-transactions');
const Transaction = require('../db/transaction');
const fail = require('assert').fail;

var chai = require('chai');
var chaiSubset = require('chai-subset');
chai.use(chaiSubset);

describe('Plaid', () => {

  const newTransaction: any = {
    plaidId: '111',
    date: '2019-01-01',
    totalAmount: 999888777666,
    account: 'Discover',
    postedDate: '2019-01-02',
    postedDescription: 'CHOCOLATE CHOCOLAT ST LOUIS',
    splits: [{ amount: 999888777666 }]
  };

  before(async function () {
    this.timeout(15000);
    await db.initDb();
  })

  afterEach(async () => {
    await Transaction.model.deleteMany({ plaidId: newTransaction.plaidId });
    await Transaction.model.deleteMany({ totalAmount: newTransaction.totalAmount });
  });

  it('create transaction if it does not exist', async () => {
    const quickTest = await Transaction.model.findOne({ plaidId: newTransaction.plaidId });
    expect(quickTest).to.be.null;

    const metrics = await saveTransactions([newTransaction]);

    const actual = await Transaction.model.findOne({ plaidId: newTransaction.plaidId });

    expect(actual).to.not.be.null;
    compareTransactions(actual, newTransaction);
    expect(metrics.newRecords).to.equal(1, 'newRecords');
    expect(metrics.updatedRecords).to.equal(0, 'updatedRecords');
    expect(metrics.totalRecords).to.equal(1, 'totalRecords');
  });

  it('edit existing transaction if new one has the same plaidId', async () => {
    const existingTransaction = {
      plaidId: '111',
      date: '2018-12-31',
      totalAmount: 1,
      account: 'Discover2',
      postedDate: '2019-12-31',
      postedDescription: 'pending transaction',
      splits: [{ amount: 1 }]
    };
    const expectedTransaction = {
      plaidId: '111',
      date: existingTransaction.date,
      totalAmount: newTransaction.totalAmount,
      account: newTransaction.account,
      postedDate: newTransaction.postedDate,
      postedDescription: newTransaction.postedDescription,
      splits: [{ amount: newTransaction.totalAmount }]
    };
    await (new Transaction.model(existingTransaction)).save()

    const metrics = await saveTransactions([newTransaction]);
    const actual = await Transaction.model.findOne({ plaidId: newTransaction.plaidId });

    compareTransactions(actual, expectedTransaction);
    expect(metrics.newRecords).to.equal(0, 'newRecords');
    expect(metrics.updatedRecords).to.equal(1, 'updatedRecords');
    expect(metrics.totalRecords).to.equal(1, 'totalRecords');
  });

  it('edit existing transaction does not clobber user-entered data (budget and description) even if amount changed', async () => {
    const existingTransaction = {
      plaidId: '111',
      date: '2018-12-31',
      totalAmount: 1,
      account: 'Discover2',
      postedDate: '2019-12-31',
      postedDescription: 'pending transaction',
      splits: [{
        amount: 1,
        budget: 'Richie',
        description: 'Richie spent a dollar'
      }]
    };
    const expectedTransaction = {
      plaidId: '111',
      date: existingTransaction.date,
      totalAmount: newTransaction.totalAmount,
      account: newTransaction.account,
      postedDate: newTransaction.postedDate,
      postedDescription: newTransaction.postedDescription,
      splits: [
        existingTransaction.splits[0],
        {
          amount: newTransaction.totalAmount - existingTransaction.totalAmount
        }
      ]
    };
    await (new Transaction.model(existingTransaction)).save()

    const metrics = await saveTransactions([newTransaction]);
    const actual = await Transaction.model.findOne({ plaidId: newTransaction.plaidId });

    compareTransactions(actual, expectedTransaction);
    expect(metrics.newRecords).to.equal(0, 'newRecords');
    expect(metrics.updatedRecords).to.equal(1, 'updatedRecords');
    expect(metrics.totalRecords).to.equal(1, 'totalRecords');
  });

  it('edit existing transaction if new one matches the amount on a manually entered one that has not been matched yet', async () => {
    const existingTransaction = {
      date: '2018-12-31',
      totalAmount: newTransaction.totalAmount,
      splits: [{
        amount: newTransaction.totalAmount,
        budget: 'Richie',
        description: 'Richie spent some monies'
      }]
    };
    const expectedTransaction = {
      plaidId: '111',
      date: existingTransaction.date,
      totalAmount: newTransaction.totalAmount,
      account: newTransaction.account,
      postedDate: newTransaction.postedDate,
      postedDescription: newTransaction.postedDescription,
      splits: [
        existingTransaction.splits[0]
      ]
    };
    await (new Transaction.model(existingTransaction)).save()

    const metrics = await saveTransactions([newTransaction]);
    const actual = await Transaction.model.findOne({ plaidId: newTransaction.plaidId });

    compareTransactions(actual, expectedTransaction);
    expect(metrics.newRecords).to.equal(0, 'newRecords');
    expect(metrics.updatedRecords).to.equal(1, 'updatedRecords');
    expect(metrics.totalRecords).to.equal(1, 'totalRecords');
  });


  it('create new transaction does not match with existing user-entered transaction when amount is different', async () => {
    // this was a bug in the app so we have a test for it. it occurred when the .amount key changed to .totalAmount
    const existingTransactionWithNulls = {
      date: '2019-12-31',
      totalAmount: 10,
      splits: [{
        amount: 10,
        budget: 'Richie',
        description: 'Richie spent ten dollars'
      }]
    };
    const existingTransactionWithBlanks = {
      plaidId: '',
      date: '2019-12-31',
      totalAmount: 10,
      account: '',
      postedDate: '',
      postedDescription: '',
      splits: [{
        amount: 10,
        budget: 'Richie',
        description: 'Richie spent ten dollars'
      }]
    };
    await (new Transaction.model(existingTransactionWithNulls)).save()
    await (new Transaction.model(existingTransactionWithBlanks)).save()

    const metrics = await saveTransactions([newTransaction]);
    const actual = await Transaction.model.findOne({ plaidId: newTransaction.plaidId });

    compareTransactions(actual, newTransaction);
    expect(metrics.newRecords).to.equal(1, 'newRecords');
    expect(metrics.updatedRecords).to.equal(0, 'updatedRecords');
    expect(metrics.totalRecords).to.equal(1, 'totalRecords');
  });


  it('edit existing transaction if new one has a different plaid id but overwrites a pending transaction', async () => {
    const existingTransaction = {
      plaidId: '999',
      date: '2018-12-31',
      totalAmount: 1,
      account: 'Discover2',
      postedDate: '2019-12-31',
      postedDescription: 'pending transaction',
      splits: [{ amount: 1 }]
    };
    newTransaction.pendingPlaidId = '999';
    const expectedTransaction = {
      plaidId: '111',
      date: existingTransaction.date,
      totalAmount: newTransaction.totalAmount,
      account: newTransaction.account,
      postedDate: newTransaction.postedDate,
      postedDescription: newTransaction.postedDescription + ' (pending transaction)',
      splits: [{ amount: newTransaction.totalAmount }]
    };
    await (new Transaction.model(existingTransaction)).save()

    const metrics = await saveTransactions([newTransaction]);
    const actual = await Transaction.model.findOne({ plaidId: newTransaction.plaidId });

    compareTransactions(actual, expectedTransaction);
    expect(metrics.newRecords).to.equal(0, 'newRecords');
    expect(metrics.updatedRecords).to.equal(1, 'updatedRecords');
    expect(metrics.totalRecords).to.equal(1, 'totalRecords');
  });



  it('create new transaction does not match with existing user-entered transaction when existing transaction is quite old', async () => {
    const elevenDayOldTransaction = {
      date: '2018-12-22',
      totalAmount: newTransaction.totalAmount,
      splits: [{
        amount: newTransaction.totalAmount,
        budget: 'Richie',
        description: 'Richie spent ten dollars'
      }]
    };
    await (new Transaction.model(elevenDayOldTransaction)).save()

    const metrics = await saveTransactions([newTransaction]);
    const actual = await Transaction.model.findOne({ plaidId: newTransaction.plaidId });

    compareTransactions(actual, newTransaction);
    expect(metrics.newRecords).to.equal(1, 'newRecords');
    expect(metrics.updatedRecords).to.equal(0, 'updatedRecords');
    expect(metrics.totalRecords).to.equal(1, 'totalRecords');
  });

  function compareTransactions(actualTransaction, expectedTransaction) {
    const differingData = areTransactionsEqual(actualTransaction, expectedTransaction);
    if (!!differingData) {
      const failureMessage = 'Expected transaction:\n' +
        JSON.stringify(actualTransaction, null, 2) +
        '\n\nto equal:\n\n' +
        JSON.stringify(expectedTransaction, null, 2) +
        `\n\nFirst difference noticed on key: ${differingData}`;
      fail(failureMessage);
    }
  }

  function areTransactionsEqual(t1, t2) {
    if (t1.plaidId != t2.plaidId) return 'plaidId';
    if (t1.totalAmount != t2.totalAmount) return 'totalAmount';
    if (t1.account != t2.account) return 'account';
    if (t1.postedDescription != t2.postedDescription) return 'postedDescription';
    if (Date.parse(t1.postedDate) != Date.parse(t2.postedDate)) return 'postedDate';

    // maintain old values
    for (let i = 0; i < t1.splits.length; i++) {
      if (t1.splits[i].amount != t2.splits[i].amount) return `splits[${i}].amount`;
      if ((t1.splits[i].budget || '') != (t2.splits[i].budget || '')) return `splits[${i}].budget`;
      if ((t1.splits[i].description || '') != (t2.splits[i].description || '')) return `splits[${i}].description`;
    }
    if (Date.parse(t1.date) != Date.parse(t2.date)) return `date`;
    return null;
  }
});

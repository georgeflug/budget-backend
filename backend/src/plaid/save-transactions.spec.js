const expect = require('chai').expect;
const db = require('../db/db');
const saveTransactions = require('./save-transactions');
const Transaction = require('../db/transaction');

var chai = require('chai');
var chaiSubset = require('chai-subset');
chai.use(chaiSubset);

describe('Plaid', () => {

  const newTransaction = {
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

    await saveTransactions([newTransaction]);

    console.log("about to retrieve it");
    const actual = await Transaction.model.findOne({ plaidId: newTransaction.plaidId });
    console.log("retrieved it");

    expect(actual).to.not.be.null;
    compareTransactions(actual, newTransaction);
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

    await saveTransactions([newTransaction]);
    const actual = await Transaction.model.findOne({ plaidId: newTransaction.plaidId });

    compareTransactions(actual, expectedTransaction);
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

    await saveTransactions([newTransaction]);
    const actual = await Transaction.model.findOne({ plaidId: newTransaction.plaidId });

    compareTransactions(actual, expectedTransaction);
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

    await saveTransactions([newTransaction]);
    const actual = await Transaction.model.findOne({ plaidId: newTransaction.plaidId });

    compareTransactions(actual, expectedTransaction);
  });

  function compareTransactions(actualTransaction, expectedTransaction) {
    // new values
    expect(actualTransaction.plaidId).to.eq(expectedTransaction.plaidId);
    expect(actualTransaction.totalAmount).to.eq(expectedTransaction.totalAmount);
    expect(actualTransaction.account).to.eq(expectedTransaction.account);
    expect(actualTransaction.postedDescription).to.eq(expectedTransaction.postedDescription);
    expect(Date.parse(actualTransaction.postedDate)).to.eq(Date.parse(expectedTransaction.postedDate), 'postedDate');

    // maintain old values
    for (let i = 0; i < actualTransaction.splits.length; i++) {
      expect(actualTransaction.splits[i].amount).to.eq(expectedTransaction.splits[i].amount, `splits[${i}]`);
      if (expectedTransaction.splits[i].budget) {
        expect(actualTransaction.splits[i].budget).to.eq(expectedTransaction.splits[i].budget, `splits[${i}]`);
      }
      if (expectedTransaction.splits[i].description) {
        expect(actualTransaction.splits[i].description).to.eq(expectedTransaction.splits[i].description, `splits[${i}]`);
      }
    }
    expect(Date.parse(actualTransaction.date)).to.eq(Date.parse(expectedTransaction.date), 'date');
  }
});

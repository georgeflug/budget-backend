// Before running this, run the following commands:
// npm i glob
import { connectToDbWithRetry } from "../db/mongo";
import { listTransactions } from "../transaction/transaction-service";
import { JsonDatabase } from "../db/json-db";
import { TransactionV2 } from "../transaction/transaction-model";
import { listFeatureIdeas } from "../feature-idea/feature-idea-service";
import { FeatureIdeaV2 } from "../feature-idea/feature-idea-model";
import { listBalances } from "../balance/balance-repository";
import { BalanceV2 } from "../balance/balance-model";
import { RawPlaidDbModel } from "../raw-plaid/raw-plaid-db-model";
import { RawPlaidV2 } from "../raw-plaid/raw-plaid-model";
import * as glob from "glob";
import { readFileSync, utimesSync } from "fs";
import { parseISO } from "date-fns";

(async () => {

  await connectToDbWithRetry("localhost");

  const transactions = await listTransactions();
  const jsonTransactionDb = new JsonDatabase<TransactionV2>("data/transactions");
  for (const transaction of transactions) {
    const transactionV2: TransactionV2 = {
      account: transaction.account,
      pending: transaction.pending,
      plaidId: transaction.plaidId,
      postedDate: transaction.postedDate,
      postedDescription: transaction.postedDescription,
      splits: transaction.splits.map(split => ({
        amount: split.amount,
        budget: split.budget,
        description: split.description
      })),
      totalAmount: transaction.totalAmount,
      createdAt: transaction.date,
      modifiedAt: transaction.updatedAt,
      recordId: 0, // will be overwritten by db layer
      version: 0 // will be overwritten by db layer
    };
    await jsonTransactionDb.createRecord(transactionV2);
  }

  const featureIdeas = await listFeatureIdeas();
  const jsonFeatureIdeaDb = new JsonDatabase<FeatureIdeaV2>("data/feature-ideas");
  for (const idea of featureIdeas) {
    const ideaV2: FeatureIdeaV2 = {
      description: idea.description,
      createdAt: idea.date,
      modifiedAt: idea.date,
      recordId: 0, // will be overwritten by db layer
      version: 0 // will be overwritten by db layer
    };
    await jsonFeatureIdeaDb.createRecord(ideaV2);
  }

  const balances = await listBalances();
  const balancesDb = new JsonDatabase<BalanceV2>("data/balances");
  for (const balance of balances) {
    const balanceV2: BalanceV2 = {
      accountId: balance.accountId,
      amount: balance.balance,
      name: balance.name,
      createdAt: balance.date,
      modifiedAt: balance.date,
      recordId: 0, // will be overwritten by db layer
      version: 0 // will be overwritten by db layer
    };
    await balancesDb.createRecord(balanceV2);
  }

  const rawPlaids = await RawPlaidDbModel.find({}).exec();
  const rawPlaidDb = new JsonDatabase<RawPlaidV2>("data/raw-plaid");
  for (const rawPlaid of rawPlaids) {
    const rawPlaidV2: RawPlaidV2 = {
      data: rawPlaid.data,
      createdAt: rawPlaid.date,
      modifiedAt: rawPlaid.date,
      recordId: 0, // will be overwritten by db layer
      version: 0 // will be overwritten by db layer
    };
    await rawPlaidDb.createRecord(rawPlaidV2);
  }

  const jsonFiles = glob.sync("data/**/*.json");
  jsonFiles.forEach(file => {
    const data = JSON.parse(readFileSync(file).toString());
    utimesSync(file, parseISO(data.createdAt), parseISO(data.modifiedAt));
  });
  console.log("done!");
  process.exit(0);

})();


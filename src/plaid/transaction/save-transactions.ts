import {TransactionSplit, TransactionV2, UnsavedTransactionV2} from "../../transaction/transaction-model";
import {TransactionService} from "../../transaction/transaction-service";
import {getTransactionService} from "../../transaction/transaction-service-instance";
import moment from "moment";

export type SaverResult = {
  newRecords: number
  updatedRecords: number
  unchangedRecords: number
  totalRecords: number
}

export class TransactionSaver {
  private service: TransactionService;

  constructor(service?: TransactionService) {
    this.service = service || getTransactionService();
  }

  async saveTransactions(transactions: UnsavedTransactionV2[]): Promise<SaverResult> {
    const results = await Promise.all(transactions
      .filter(t => !t.pending)
      .map(t => this.saveTransaction(t))
    );
    const existingCount = results.filter(item => item.type === "updated").length;
    const unchangedCount = results.filter(item => item.type === "unchanged").length;
    const totalCount = results.length;
    const newRecords = totalCount - existingCount - unchangedCount;

    return {
      newRecords: newRecords,
      updatedRecords: existingCount,
      unchangedRecords: unchangedCount,
      totalRecords: totalCount
    };
  }

  private async saveTransaction(transaction: UnsavedTransactionV2) {
    const existingTransaction = await this.getExistingTransaction(transaction.plaidId);
    if (existingTransaction) {
      if (isTransactionTheSame(transaction, existingTransaction)) {
        return {
          type: "unchanged",
          transaction: existingTransaction
        };
      } else {
        return {
          type: "updated",
          transaction: await this.updateExistingTransaction(transaction, existingTransaction)
        };
      }
    } else {
      return {
        type: "new",
        transaction: await this.service.createTransaction(transaction)
      };
    }
  }

  private async getExistingTransaction(plaidId: string): Promise<TransactionV2 | undefined> {
    try {
      return await this.service.findTransactionByPlaidId(plaidId);
    } catch (e) {
      return undefined;
    }
  }

  private async updateExistingTransaction(plaidTransaction: UnsavedTransactionV2, existingTransaction: TransactionV2) {
    const updatedTransaction = {
      ...existingTransaction,
      ...plaidTransaction,
      splits: getUpdatedSplits(existingTransaction.splits, plaidTransaction.totalAmount)
    };
    return await this.service.updateTransaction(existingTransaction.recordId, existingTransaction.version, updatedTransaction);
  }

}

function isTransactionTheSame(plaidTransaction: UnsavedTransactionV2, existingTransaction: TransactionV2) {
  return (
    existingTransaction.postedDescription === plaidTransaction.postedDescription &&
    existingTransaction.plaidId === plaidTransaction.plaidId &&
    existingTransaction.account === plaidTransaction.account &&
    existingTransaction.totalAmount === plaidTransaction.totalAmount &&
    moment(existingTransaction.postedDate).isSame(plaidTransaction.postedDate)
  );
}

function getUpdatedSplits(splits: TransactionSplit[], totalAmount: number): TransactionSplit[] {
  const budgetedSplits = splits.filter(split => !!split.budget);
  const splitTotal = budgetedSplits.reduce((accumulated, split) => accumulated + split.amount, 0);
  if (splitTotal !== totalAmount) {
    return [
      ...budgetedSplits,
      {
        amount: totalAmount - splitTotal,
        budget: '',
        description: '',
      }
    ];
  }
  return budgetedSplits;
}

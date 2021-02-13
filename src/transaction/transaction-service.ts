import { SmartDate } from "../util/smart-date";
import { TransactionSplit, TransactionV2, UnsavedTransactionV2 } from "./transaction-model";
import { TransactionRepository } from "./transaction-repository";

export class TransactionService {
  private repository: TransactionRepository;

  constructor(repository?: TransactionRepository) {
    this.repository = repository || new TransactionRepository();
  }

  async createTransaction(transaction: UnsavedTransactionV2): Promise<TransactionV2> {
    verifySplits(transaction.totalAmount, transaction.splits);
    return await this.repository.saveTransaction(transaction);
  }

  async listTransactions(): Promise<TransactionV2[]> {
    return await this.repository.listTransactions();
  }

  async listTransactionsAfter(startingAt: Date): Promise<TransactionV2[]> {
    const results = await this.listTransactions();
    const smartStartingAt = SmartDate.of(startingAt);
    return results.filter(record => smartStartingAt.isSameOrBefore(record.modifiedAt));
  }

  async findTransactionById(id: number): Promise<TransactionV2> {
    return await this.repository.findTransactionById(id);
  }

  async findTransactionByPlaidId(plaidId: string): Promise<TransactionV2> {
    const results = await this.listTransactions();
    const transaction = results.find(t => t.plaidId === plaidId);
    if (!transaction) {
      throw new Error(`Could not find transaction by Plaid ID: ${plaidId}`);
    }
    return transaction;
  }

  async updateTransactionSplits(id: number, version: number, splits: TransactionSplit[]): Promise<TransactionV2> {
    const existingTransaction = await this.findTransactionById(id);
    const newTransaction = {
      ...existingTransaction,
      splits: splits,
    };
    return await this.updateTransaction(id, version, newTransaction);
  }

  async updateTransaction(id: number, version: number, transaction: UnsavedTransactionV2): Promise<TransactionV2> {
    verifySplits(transaction.totalAmount, transaction.splits);
    return await this.repository.updateTransactionById(id, version, transaction);
  }
}

function verifySplits(totalAmount: number, splits: TransactionSplit[]) {
  const totalSplits = splits.reduce((total, currentSplit) => total + currentSplit.amount, 0);
  if (Math.abs(totalAmount - totalSplits) > 0.0001) {
    throw new Error(`Total Amount ${totalAmount} does not match sum of split amounts ${totalSplits}`);
  }
}

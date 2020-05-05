import * as repository from "./transaction-repository";

export async function clearTransactions() {
  const transactions = await repository.listTransactions();
  for (const transaction of transactions) {
    await repository.deleteTransaction(transaction);
  }
}

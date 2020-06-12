package com.georgeflug.budget.service

import android.annotation.SuppressLint
import com.georgeflug.budget.BudgetApplication
import com.georgeflug.budget.api.BudgetApi
import com.georgeflug.budget.model.NewTransaction
import com.georgeflug.budget.model.Transaction
import com.georgeflug.budget.model.TransactionSplit
import com.georgeflug.budget.model.TransactionUpdateRequest
import com.georgeflug.budget.util.AlertUtil
import com.georgeflug.budget.util.DateUtil
import io.reactivex.Completable
import io.reactivex.Observable
import io.reactivex.Single
import io.reactivex.android.schedulers.AndroidSchedulers
import io.reactivex.subjects.PublishSubject
import io.reactivex.subjects.ReplaySubject
import java.math.BigDecimal

object TransactionService {
    private val initial = ReplaySubject.create<List<Transaction>>()

    private val updates = PublishSubject.create<Transaction>()
    private val obs: Observable<Transaction> = updates.cache()

    @SuppressLint("CheckResult")
    fun downloadTransactions() {
        downloadTransactionsObservable()
                .observeOn(AndroidSchedulers.mainThread())
                .subscribe({ }, ::handleError)
    }

    fun downloadTransactionsObservable(): Single<List<Transaction>> {
        val persistedTransactions = PersistedTransactionService.getPersistedTransactions()
        val latestTimestamp = PersistedTransactionService.getLatestTimestamp(persistedTransactions)
        initial.onNext(persistedTransactions)

        return BudgetApi.transactions.listTransactions(latestTimestamp)
                .map { transactions ->
                    val newIds = transactions.map { it.id }
                    val keepTransactions = persistedTransactions
                            .filter { !newIds.contains(it.id) }

                    transactions
                            .union(keepTransactions)
                            .sortedBy { it.bestDate }
                            .asReversed()
                            .map { copyTransactionWithSortedSplits(it) }
                }
                .doOnSuccess { transactions -> initial.onNext(transactions) }
    }

    fun getInitialTransactions(): Observable<List<Transaction>> = initial
    fun listenForNewTransactions() = obs

    fun addTransaction(amount: BigDecimal, budget: String, description: String): Single<Transaction> {
        val date = DateUtil.getToday()
        val newSplit = TransactionSplit(amount = amount, budget = budget, description = description)
        val newTransaction = NewTransaction(date = date, totalAmount = amount, splits = listOf(newSplit))
        return BudgetApi.transactions.createTransaction(newTransaction)
                .doOnSuccess { transaction -> updates.onNext(transaction) }
    }

    fun updateTransaction(transaction: Transaction): Single<Transaction> {
        val updateRequest = TransactionUpdateRequest(transaction.version, transaction.splits)
        return BudgetApi.transactions.updateTransaction(transaction.id, updateRequest)
                .doOnSuccess { updatedTransaction -> updates.onNext(updatedTransaction) }
    }

    fun refresh(): Completable {
        return BudgetApi.transactions.refreshTransactions()
                .flatMap { downloadTransactionsObservable() } // emits twice??? TODO
                .ignoreElement()
    }

    private fun handleError(throwable: Throwable) {
        AlertUtil.showError(BudgetApplication.getAppContext(), throwable, "Could not retrieve transactions")
    }

    private fun copyTransactionWithSortedSplits(transaction: Transaction): Transaction {
        return Transaction(
                id = transaction.id,
                version = transaction.version,
                totalAmount = transaction.totalAmount,
                account = transaction.account,
                postedDate = transaction.postedDate,
                postedDescription = transaction.postedDescription,
                splits = transaction.splits.sortedBy { it.amount }.asReversed(),
                updatedAt = transaction.updatedAt,
                createdAt = transaction.createdAt
        )
    }
}

package com.georgeflug.budget.service

import android.annotation.SuppressLint
import com.georgeflug.budget.BudgetApplication
import com.georgeflug.budget.api.BudgetApi
import com.georgeflug.budget.model.NewTransaction
import com.georgeflug.budget.model.Transaction
import com.georgeflug.budget.model.TransactionSplit
import com.georgeflug.budget.util.AlertUtil
import com.georgeflug.budget.util.DateUtil
import io.reactivex.Completable
import io.reactivex.Observable
import io.reactivex.android.schedulers.AndroidSchedulers
import io.reactivex.subjects.PublishSubject
import io.reactivex.subjects.ReplaySubject
import java.math.BigDecimal

object TransactionService {
    private val initial = ReplaySubject.create<List<Transaction>>()

    private val updates = PublishSubject.create<Transaction>()
    private val obs: Observable<Transaction> = updates.cache()
    private val all = Observable.concat(initial.flatMapIterable { it }, obs)

    @SuppressLint("CheckResult")
    fun downloadTransactions() {
        downloadTransactionsObservable()
                .observeOn(AndroidSchedulers.mainThread())
                .subscribe({ }, ::handleError)
    }

    private fun downloadTransactionsObservable(): Observable<List<Transaction>> {
        val persistedTransactions = PersistedTransactionService.getPersistedTransactions()
        val latestTimestamp = PersistedTransactionService.getLatestTimestamp(persistedTransactions)
        initial.onNext(persistedTransactions)

        return BudgetApi.transactions.listTransactions(latestTimestamp)
                .map { transactions ->
                    transactions
                            .union(persistedTransactions)
                            .sortedBy { it.bestDate }
                            .asReversed()
                            .map { copyTransactionWithSortedSplits(it) }
                }
                .doOnNext { transactions -> initial.onNext(transactions) }
    }

    fun getInitialTransactions(): Observable<List<Transaction>> = initial
    fun listenForNewTransactions() = obs

    fun getAllTransactions() = all

    fun addTransaction(amount: BigDecimal, budget: String, description: String): Observable<Transaction> {
        val date = DateUtil.getToday()
        val newSplit = TransactionSplit(amount = amount, budget = budget, description = description)
        val newTransaction = NewTransaction(date = date, totalAmount = amount, splits = listOf(newSplit))
        return BudgetApi.transactions.createTransaction(newTransaction)
                .doOnNext { transaction -> updates.onNext(transaction) }
    }

    fun updateTransaction(transaction: Transaction): Observable<Transaction> {
        return BudgetApi.transactions.updateTransaction(transaction._id, transaction)
                .doOnNext { transaction -> updates.onNext(transaction) }
    }

    fun refresh(): Completable {
        return BudgetApi.transactions.refreshTransactions()
                .flatMap { downloadTransactionsObservable() } // emits twice
                .skip(1)
                .ignoreElements()
    }

    private fun handleError(throwable: Throwable) {
        AlertUtil.showError(BudgetApplication.getAppContext(), throwable, "Could not retrieve transactions")
    }

    private fun copyTransactionWithSortedSplits(transaction: Transaction): Transaction {
        return Transaction(
                _id = transaction._id,
                plaidId = transaction.plaidId,
                date = transaction.date,
                totalAmount = transaction.totalAmount,
                account = transaction.account,
                postedDate = transaction.postedDate,
                postedDescription = transaction.postedDescription,
                splits = transaction.splits.sortedBy { it.amount }.asReversed()
        )
    }
}

package com.georgeflug.budget.service

import com.georgeflug.budget.api.BudgetApi
import com.georgeflug.budget.model.NewTransaction
import com.georgeflug.budget.model.Transaction
import com.georgeflug.budget.model.TransactionSplit
import com.georgeflug.budget.util.DateUtil
import io.reactivex.Observable
import io.reactivex.subjects.BehaviorSubject
import io.reactivex.subjects.PublishSubject
import java.math.BigDecimal

object TransactionService {
    private val initial = BehaviorSubject.create<List<Transaction>>()

    private val updates = PublishSubject.create<Transaction>()
    private val obs: Observable<Transaction> = updates.cache()

    fun downloadTransactions() {
        BudgetApi.transactions.listTransactions()
                .subscribe { transactions -> initial.onNext(transactions) }
    }

    fun listen() = obs

    fun getInitialTransactions(): Observable<List<Transaction>> = initial

    fun addTransaction(amount: BigDecimal, budget: String, description: String): Observable<Transaction> {
        val date = DateUtil.getToday()
        val newSplit = TransactionSplit(amount = amount, budget = budget, description = description)
        val newTransaction = NewTransaction(date = date, totalAmount = amount, splits = listOf(newSplit))
        return BudgetApi.transactions.createTransaction(newTransaction)
                .doOnNext { transaction -> updates.onNext(transaction) }
    }
}

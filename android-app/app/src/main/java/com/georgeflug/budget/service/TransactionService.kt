package com.georgeflug.budget.service

import com.georgeflug.budget.api.BudgetApi
import com.georgeflug.budget.model.Transaction
import io.reactivex.Observable
import io.reactivex.subjects.BehaviorSubject
import io.reactivex.subjects.PublishSubject

object TransactionService {
    private val initial = BehaviorSubject.create<List<Transaction>>()

    private val subject = PublishSubject.create<Transaction>()
    private val obs: Observable<Transaction> = subject.cache()

    fun downloadTransactions() {
        BudgetApi.transactions.listTransactions()
                .subscribe { transactions -> initial.onNext(transactions) }
    }

    fun listen() = obs

    fun getInitialTransactions(): Observable<List<Transaction>> = initial

}

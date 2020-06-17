package com.georgeflug.budget.transactions

import com.georgeflug.budget.model.Transaction
import com.georgeflug.budget.service.OldTransactionService
import io.reactivex.Completable

class TransactionService {
    companion object {
        val INSTANCE = TransactionService()
    }

    lateinit var transactions: List<Transaction>

    fun initialize(): Completable {
        return OldTransactionService.downloadTransactionsObservable()
                .doOnSuccess { transactions = it }
                .ignoreElement()
    }

    fun getAll(): List<Transaction> {
        return transactions
    }

}
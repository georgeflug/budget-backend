package com.georgeflug.budget.view.main

import android.annotation.SuppressLint
import com.georgeflug.budget.model.Budget
import com.georgeflug.budget.model.Transaction
import com.georgeflug.budget.service.OldTransactionService
import io.reactivex.android.schedulers.AndroidSchedulers

class CountModel {
    private var count = 0
    private val savedTransactions = mutableListOf<Transaction>()

    init {
        listenForTransactions()
    }

    @SuppressLint("CheckResult")
    private fun listenForTransactions() {
        OldTransactionService.getInitialTransactions()
                .observeOn(AndroidSchedulers.mainThread())
                .subscribe({ countInitialTransactions(it) }, ::handleError)
        OldTransactionService.listenForNewTransactions()
                .observeOn(AndroidSchedulers.mainThread())
                .subscribe({ countTransaction(it) }, ::handleError)
    }

    private fun countInitialTransactions(transactions: List<Transaction>) {
        count = transactions.stream()
                .filter(::isUncategorized)
                .count().toInt()
        savedTransactions.clear()
        savedTransactions.addAll(transactions)
        onCountUpdated()
    }

    private fun countTransaction(transaction: Transaction) {
        val existingIndex = savedTransactions.indexOfFirst { it.id == transaction.id }

        val oldUncategorized = isUncategorized(savedTransactions[existingIndex])
        val newUncategorized = isUncategorized(transaction)
        if (!oldUncategorized) count += 1
        if (!newUncategorized) count -= 1

        if (existingIndex < 0) {
            savedTransactions.add(transaction)
        } else {
            savedTransactions[existingIndex] = transaction
        }

        onCountUpdated()
    }

    private fun handleError(throwable: Throwable) {
        // do nothing
    }

    private fun onCountUpdated() {
        MainActivity.updateTransactionCount(count)
    }

    private fun isUncategorized(transaction: Transaction): Boolean {
        return transaction.splits.any { it.realBudget == Budget.UNKNOWN }
    }
}

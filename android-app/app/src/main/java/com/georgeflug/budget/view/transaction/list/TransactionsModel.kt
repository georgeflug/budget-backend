package com.georgeflug.budget.view.transaction.list

import com.georgeflug.budget.BudgetApplication
import com.georgeflug.budget.model.Transaction
import com.georgeflug.budget.service.TransactionService
import com.georgeflug.budget.util.AlertUtil
import com.georgeflug.budget.util.DateUtil
import io.reactivex.android.schedulers.AndroidSchedulers

class TransactionsModel {
    data class SectionOrTransaction(val section: Section?, val transaction: Transaction?)

    val items = ArrayList<SectionOrTransaction>()
    private val listeners = ArrayList<Runnable>()

    init {
        TransactionService.getInitialTransactions()
                .doOnNext(::saveInitialTransactions)
                .observeOn(AndroidSchedulers.mainThread())
                .subscribe({}, ::handleError)
        TransactionService.listen()
                .doOnNext(::saveTransaction)
                .observeOn(AndroidSchedulers.mainThread())
                .subscribe({}, ::handleError)
    }

    val size: Int
        get() = items.size

    fun getSectionOrTransactionAt(position: Int): SectionOrTransaction {
        return items.get(position)
    }

    fun registerOnChange(onChange: Runnable) {
        listeners.add(onChange)
    }

    private fun saveInitialTransactions(transactions: List<Transaction>) {
        val sorted = transactions.sortedBy { it.getBestDate() }.reversed()
        val newList = ArrayList<SectionOrTransaction>(sorted.size)
        var lastDate = ""
        for (transaction in sorted) {
            val currentDate = transaction.getBestDate()
            if (lastDate != currentDate) {
                newList.add(SectionOrTransaction(Section(DateUtil.getFriendlyDate(currentDate)), null))
            }
            newList.add(SectionOrTransaction(null, transaction))
            lastDate = currentDate
        }
        items.clear()
        items.addAll(newList)
        onChange()
    }

    private fun saveTransaction(transaction: Transaction) {
        val newTransactions = items
                .map { it.transaction }
                .filter { it != null }
                .toMutableList()
        newTransactions.add(transaction)
        saveInitialTransactions(newTransactions as List<Transaction>)
    }

    private fun handleError(throwable: Throwable) {
        AlertUtil.showError(BudgetApplication.getAppContext(), throwable, "Could not retrieve transactions")
    }

    private fun onChange() {
        listeners.forEach { it.run() }
    }
}

package com.georgeflug.budget.view.transaction.list

import android.annotation.SuppressLint
import com.georgeflug.budget.BudgetApplication
import com.georgeflug.budget.model.Budget
import com.georgeflug.budget.model.Transaction
import com.georgeflug.budget.service.TransactionService
import com.georgeflug.budget.util.AlertUtil
import com.georgeflug.budget.util.DateUtil
import io.reactivex.android.schedulers.AndroidSchedulers
import java.time.LocalDate

class TransactionsFilteredModel(
        val filterMonth: Int? = null,
        val filterYear: Int? = null,
        val filterBudget: Budget? = null
) : TransactionsModel {
    override val items = ArrayList<SectionOrTransaction>()
    private var listener: (() -> Unit)? = null

    init {
        listenForTransactions()
    }

    override val size: Int
        get() = items.size

    override fun getSectionOrTransactionAt(position: Int): SectionOrTransaction {
        return items.get(position)
    }

    override fun setOnChangeListener(onChange: () -> Unit) {
        listener = onChange
    }

    @SuppressLint("CheckResult")
    private fun listenForTransactions() {
        TransactionService.getInitialTransactions()
                .doOnNext(::saveInitialTransactions)
                .observeOn(AndroidSchedulers.mainThread())
                .subscribe({ onChange() }, ::handleError)
        TransactionService.listenForNewTransactions()
                .doOnNext(::saveTransaction)
                .observeOn(AndroidSchedulers.mainThread())
                .subscribe({ onChange() }, ::handleError)
    }

    private fun saveInitialTransactions(transactions: List<Transaction>) {
        val newList = ArrayList<SectionOrTransaction>(transactions.size)
        var lastDate = LocalDate.MIN
        for (transaction in transactions) {
            if (matchesFilter(transaction)) {
                val currentDate = transaction.bestDate
                if (lastDate != currentDate) {
                    newList.add(SectionOrTransaction(Section(DateUtil.getFriendlyDate(currentDate)), null))
                }
                newList.add(SectionOrTransaction(null, transaction))
                lastDate = currentDate
            }
        }
        items.clear()
        items.addAll(newList)
    }

    private fun saveTransaction(transaction: Transaction) {
        val newTransactions = items
                .filter { it.transaction != null }
                .map { it.transaction!! }
                .toMutableList()
        val existingIndex = newTransactions.indexOfFirst { it._id == transaction._id }
        if (existingIndex < 0) {
            newTransactions.add(transaction)
        } else {
            newTransactions[existingIndex] = transaction
        }
        saveInitialTransactions(newTransactions)
    }

    private fun handleError(throwable: Throwable) {
        AlertUtil.showError(BudgetApplication.getAppContext(), throwable, "Could not retrieve transactions")
    }

    private fun onChange() {
        listener?.invoke()
    }

    private fun matchesFilter(transaction: Transaction): Boolean {
        return matchesFilterMonth(transaction) && matchesFilterYear(transaction) && matchesFilterBudget(transaction)
    }

    private fun matchesFilterMonth(transaction: Transaction): Boolean {
        return filterMonth == null || transaction.bestDate.monthValue == filterMonth
    }

    private fun matchesFilterYear(transaction: Transaction): Boolean {
        return filterYear == null || transaction.bestDate.year == filterYear
    }

    private fun matchesFilterBudget(transaction: Transaction): Boolean {
        return filterBudget == null || transaction.splits.any { it.realBudget == filterBudget }
    }
}

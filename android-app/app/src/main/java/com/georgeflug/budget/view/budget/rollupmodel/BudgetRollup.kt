package com.georgeflug.budget.view.budget.rollupmodel

import android.annotation.SuppressLint
import com.georgeflug.budget.BudgetApplication
import com.georgeflug.budget.model.Transaction
import com.georgeflug.budget.service.TransactionService
import com.georgeflug.budget.util.AlertUtil
import com.georgeflug.budget.view.budget.tabmodel.BudgetTabModel
import io.reactivex.schedulers.Schedulers
import java.time.LocalDate

class BudgetRollup {
    private val budgets = HashMap<LocalDate, MonthRollup>()
    private val rollupList = ArrayList<MonthRollup>()
    private var listener: Runnable? = null

    init {
        listenForTransactions()
    }

    @SuppressLint("CheckResult")
    private fun listenForTransactions() {
        TransactionService.getInitialTransactions()
                .observeOn(Schedulers.computation())
                .subscribe({ transactions ->
                    reset()
                    transactions.forEach(::processTransaction)
                    onChange()
                }, ::handleError)
        TransactionService.listenForNewTransactions()
                .observeOn(Schedulers.computation())
                .subscribe({
                    processTransaction(it)
                    onChange()
                }, ::handleError)
    }

    private fun reset() {
        rollupList.clear()
        BudgetTabModel().getBudgetMonths().forEach { monthAndName ->
            val rollup = MonthRollup(monthAndName.month)
            rollupList.add(rollup)
            budgets[monthAndName.month] = rollup
        }
    }

    fun getMonth(month: LocalDate): MonthRollup {
        val normalizedMonth = LocalDate.of(month.year, month.month, 1)
        return budgets[normalizedMonth]!!
    }

    fun setOnChangeListener(onChange: Runnable?) {
        listener = onChange
    }

    private fun processTransaction(transaction: Transaction) {
        rollupList.forEach { it.addTransaction(transaction) }
    }

    private fun handleError(throwable: Throwable) {
        AlertUtil.showError(BudgetApplication.getAppContext(), throwable, "Could not process transactions")
    }

    private fun onChange() {
        listener?.run()
    }
}

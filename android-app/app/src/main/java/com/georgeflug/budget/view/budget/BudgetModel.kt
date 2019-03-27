package com.georgeflug.budget.view.budget

import com.georgeflug.budget.BudgetApplication
import com.georgeflug.budget.model.Transaction
import com.georgeflug.budget.service.TransactionService
import com.georgeflug.budget.util.AlertUtil
import io.reactivex.android.schedulers.AndroidSchedulers
import io.reactivex.schedulers.Schedulers
import java.time.LocalDate

class BudgetModel {
    private val budgets = HashMap<LocalDate, MonthRollup>()
    private val rollupList = ArrayList<MonthRollup>()

    init {
        BudgetMonths().getBudgetMonths().forEach { budgetAndMonth ->
            val rollup = MonthRollup(budgetAndMonth.month)
            rollupList.add(rollup)
            budgets.put(budgetAndMonth.month, rollup)
        }

        TransactionService.getAllTransactions()
                .doOnNext(::processTransaction)
                .subscribeOn(Schedulers.computation())
                .observeOn(AndroidSchedulers.mainThread())
                .subscribe({}, ::handleError)
    }

    fun getMonth(month: LocalDate): MonthRollup {
        val normalizedMonth = LocalDate.of(month.year, month.month, 1)
        return budgets[normalizedMonth]!!
    }

    private fun processTransaction(transaction: Transaction) {
        rollupList.forEach { it.addTransaction(transaction) }
    }

    private fun handleError(throwable: Throwable) {
        AlertUtil.showError(BudgetApplication.getAppContext(), throwable, "Could not process transactions")
    }
}

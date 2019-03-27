package com.georgeflug.budget.view.budget

import com.georgeflug.budget.model.Budget
import com.georgeflug.budget.model.Transaction
import com.georgeflug.budget.model.TransactionSplit
import com.georgeflug.budget.util.DateUtil
import java.time.LocalDate
import java.time.Period

class MonthRollup(private val month: LocalDate) {

    private val budgetMap = HashMap<Budget, MonthCategoryRollup>()
    val budgets
        get() = budgetMap.values
    private val monthCount = Period.between(DateUtil.firstDay, month).months + 1

    fun addTransaction(transaction: Transaction) {
        if (transaction.bestDate.isBefore(month)) {
            addCarryovers(transaction)
        } else if (isSameMonth(transaction.bestDate, month)) {
            addTransactions(transaction)
        }
    }

    private fun getBudget(transactionSplit: TransactionSplit): MonthCategoryRollup {
        return budgetMap.computeIfAbsent(transactionSplit.realBudget) { budget ->
            MonthCategoryRollup(budget, monthCount)
        }
    }

    private fun addCarryovers(transaction: Transaction) {
        transaction.splits.forEach { split ->
            val budget = getBudget(split)
            budget.addCarryoverTransaction(split)
        }
    }

    private fun addTransactions(transaction: Transaction) {
        transaction.splits.forEach { split ->
            val budget = getBudget(split)
            budget.addTransaction(split)
        }
    }

    private fun isSameMonth(firstDate: LocalDate, secondDate: LocalDate): Boolean {
        return firstDate.month == secondDate.month && firstDate.year == secondDate.year
    }
}

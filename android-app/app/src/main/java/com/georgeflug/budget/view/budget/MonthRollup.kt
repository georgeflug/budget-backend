package com.georgeflug.budget.view.budget

import com.georgeflug.budget.model.Budget
import com.georgeflug.budget.model.Transaction
import com.georgeflug.budget.model.TransactionSplit
import java.time.LocalDate
import java.time.Period

class MonthRollup(private val month: LocalDate) {

    private val budgetMap = HashMap<Budget, BudgetRollup>()
    val budgets
        get() = budgetMap.values
    private val firstMonth = LocalDate.of(2018, 9, 1)
    private val monthCount = Period.between(firstMonth, month).months + 1

    fun addTransaction(transaction: Transaction) {
        if (transaction.bestDate.isBefore(month)) {
            addCarryovers(transaction)
        } else if (isSameMonth(transaction.bestDate, month)) {
            addTransactions(transaction)
        }
    }

    private fun getBudget(transactionSplit: TransactionSplit): BudgetRollup {
        return budgetMap.computeIfAbsent(transactionSplit.realBudget) { budget ->
            BudgetRollup(budget, monthCount)
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

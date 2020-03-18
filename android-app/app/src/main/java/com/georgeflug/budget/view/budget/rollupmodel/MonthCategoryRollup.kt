package com.georgeflug.budget.view.budget.rollupmodel

import com.georgeflug.budget.model.Budget
import com.georgeflug.budget.model.BudgetAmountService
import com.georgeflug.budget.model.TransactionSplit
import java.math.BigDecimal

class MonthCategoryRollup(val budget: Budget, carryoverMonths: Int) {
    val title = budget.title
    val iconId = budget.iconId
    var total: BigDecimal = BigDecimal.ZERO
        private set
    val budgetAmounts = BudgetAmountService.getBudgetsForCategory(budget)
    val hasAllocatedAmount = budgetAmounts.isNotEmpty()
    val perMonth = budgetAmounts.map { it.amount }.lastOrNull() ?: 0
    var remainingToSpend: BigDecimal = BigDecimal.valueOf(BudgetAmountService.getAllocatedBudget(budgetAmounts, carryoverMonths))
        private set

    fun addTransaction(transactionSplit: TransactionSplit) {
        total += transactionSplit.amount
        remainingToSpend -= transactionSplit.amount
    }

    fun addCarryoverTransaction(transactionSplit: TransactionSplit) {
        remainingToSpend -= transactionSplit.amount
    }
}

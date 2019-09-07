package com.georgeflug.budget.view.budget

import com.georgeflug.budget.model.Budget
import com.georgeflug.budget.model.TransactionSplit
import java.math.BigDecimal

class MonthCategoryRollup(val budget: Budget, carryoverMonths: Long) {
    val title = budget.title
    val iconId = budget.iconId
    var total: BigDecimal = BigDecimal.ZERO
        private set
    val perMonth = if (budget.hasAmount()) budget.amount!! else BigDecimal.ZERO
    var remainingToSpend: BigDecimal = perMonth * BigDecimal(carryoverMonths)
        private set

    fun addTransaction(transactionSplit: TransactionSplit) {
        total += transactionSplit.amount
        remainingToSpend -= transactionSplit.amount
    }

    fun addCarryoverTransaction(transactionSplit: TransactionSplit) {
        remainingToSpend -= transactionSplit.amount
    }
}

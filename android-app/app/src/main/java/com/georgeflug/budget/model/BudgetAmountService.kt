package com.georgeflug.budget.model

import com.georgeflug.budget.util.DateUtil
import java.time.LocalDate
import java.time.Period

class BudgetAmountService {
    companion object {
        val allBudgets = listOf<BudgetAmount>(
                BudgetAmount(Budget.CLOTHES, 70, DateUtil.firstDay),
                BudgetAmount(Budget.GROCERIES, 400, DateUtil.firstDay),
                BudgetAmount(Budget.ENTERTAINMENT, 150, DateUtil.firstDay),
                BudgetAmount(Budget.RICHIE, 120, DateUtil.firstDay),
                BudgetAmount(Budget.RICHIE, 150, LocalDate.of(2020, 1, 1)),
                BudgetAmount(Budget.STEF, 120, DateUtil.firstDay),
                BudgetAmount(Budget.STEF, 150, LocalDate.of(2020, 1, 1))
        )

        fun getBudgetsForCategory(category: Budget): List<BudgetAmount> {
            return allBudgets.filter { it.category == category }
        }

        fun getAllocatedBudget(budgetAmounts: List<BudgetAmount>, totalNumberOfMonths: Int): Long {
            var remainingMonths = totalNumberOfMonths
            var totalAmountToSpend: Long = 0

            for (i in budgetAmounts.indices) {
                val current = budgetAmounts[i]
                val next = budgetAmounts.getOrNull(i + 1)
                if (next == null) {
                    totalAmountToSpend += current.amount * remainingMonths
                } else if (remainingMonths > 0) {
                    // TODO: write test. This could be off-by-one
                    val monthCount = Period.between(current.startDate, next.startDate).months
                    val monthsOfBudget = monthCount.coerceAtMost(remainingMonths)
                    remainingMonths -= monthsOfBudget
                    totalAmountToSpend += current.amount * monthsOfBudget
                }
            }

            return totalAmountToSpend
        }
    }
}

package com.georgeflug.budget.model

import com.georgeflug.budget.util.DateUtil
import org.assertj.core.api.Assertions.assertThat
import org.junit.Test

class BudgetAmountServiceTest {

    @Test
    fun getAllocatedBudget_ShouldReturn1MonthOfBudget() {
        val budgets = listOf(BudgetAmount(Budget.GAS, 100, DateUtil.firstDay))

        val amount = BudgetAmountService.getAllocatedBudget(budgets, 1)

        assertThat(amount).isEqualTo(100)
    }

    @Test
    fun getAllocatedBudget_ShouldReturn1MonthOfBudget_WhenNewerBudgetStartsTheFollowingMonth() {
        val budgets = listOf(
                BudgetAmount(Budget.GAS, 100, DateUtil.firstDay),
                BudgetAmount(Budget.GAS, 150, DateUtil.firstDay.plusMonths(1))
        )

        val amount = BudgetAmountService.getAllocatedBudget(budgets, 1)

        assertThat(amount).isEqualTo(100)
    }

    @Test
    fun getAllocatedBudget_ShouldReturn1MonthOfOldBudgetPlus1MonthOfNewBudget_WhenNewerBudgetStartsTheFollowingMonth() {
        val budgets = listOf(
                BudgetAmount(Budget.GAS, 100, DateUtil.firstDay),
                BudgetAmount(Budget.GAS, 150, DateUtil.firstDay.plusMonths(1))
        )

        val amount = BudgetAmountService.getAllocatedBudget(budgets, 2)

        assertThat(amount).isEqualTo(250)
    }

    @Test
    fun getAllocatedBudget_ShouldReturnSeveralMonthsOfMixedBudgets() {
        val budgets = listOf(
                BudgetAmount(Budget.GAS, 100, DateUtil.firstDay),
                BudgetAmount(Budget.GAS, 150, DateUtil.firstDay.plusMonths(10)),
                BudgetAmount(Budget.GAS, 200, DateUtil.firstDay.plusMonths(15))
        )

        val amount = BudgetAmountService.getAllocatedBudget(budgets, 20)

        assertThat(amount).isEqualTo(100 * 10 + 150 * 5 + 200 * 5)
    }
}

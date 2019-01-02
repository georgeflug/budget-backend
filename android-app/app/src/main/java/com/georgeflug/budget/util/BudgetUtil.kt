package com.georgeflug.budget.util

import android.support.v4.app.FragmentActivity
import com.georgeflug.budget.R
import com.georgeflug.budget.budgets.BudgetsFragment
import java.time.LocalDate

class BudgetUtil {
    companion object {
        fun updateBudgets(mainActivity: FragmentActivity) {
            val budgetFragment = mainActivity.supportFragmentManager.findFragmentById(R.id.budgetsFragment) as BudgetsFragment
            budgetFragment.rePopulateBudgets(LocalDate.now())
        }
    }
}
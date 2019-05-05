package com.georgeflug.budget.view.budget

import android.app.Fragment
import android.app.FragmentManager
import com.georgeflug.budget.R
import com.georgeflug.budget.view.main.MainActivity

object BudgetFragmentUtil {
    private const val BACKSTACK_NAME = "BudgetBackstack"

    fun showAndAddToBackStack(fragment: Fragment) {
        MainActivity.fragmentManager
                .beginTransaction()
                .replace(R.id.budgetTabFragmentContainer, fragment)
                .addToBackStack(BACKSTACK_NAME)
                .commit()
    }

    fun popBackStack() {
        MainActivity.fragmentManager.popBackStack()
    }

    fun clearBackStack() {
        MainActivity.fragmentManager.popBackStack(BACKSTACK_NAME, FragmentManager.POP_BACK_STACK_INCLUSIVE)
    }
}
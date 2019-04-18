package com.georgeflug.budget.view.transaction.edit

import android.app.Fragment
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import com.georgeflug.budget.R
import com.georgeflug.budget.model.Budget
import com.georgeflug.budget.util.FragmentUtil
import kotlinx.android.synthetic.main.fragment_select_budget.*

class SelectBudgetFragment : Fragment() {

    var budget: Budget? = null
    private val enterDescriptionFragment = EnterDescriptionFragment()
    val isSuccess
        get() = enterDescriptionFragment.isSuccess
    var description
        get() = enterDescriptionFragment.description
        set(value) {
            enterDescriptionFragment.description = value
        }

    override fun onCreateView(inflater: LayoutInflater, container: ViewGroup, savedInstanceState: Bundle?): View {
        return inflater.inflate(R.layout.fragment_select_budget, container, false)
    }

    override fun onResume() {
        super.onResume()

        nextButton.setOnClickListener {
            FragmentUtil.showAndAddToBackStack(enterDescriptionFragment)
        }

        budgetSelector.setOnClickListener {
            budget = budgetSelector.selectedBudget
            nextButton.isEnabled = true
        }

        val budget = budget
        if (budget != null) {
            budgetSelector.selectedBudget = budget
        } else {
            nextButton.isEnabled = false
        }
    }
}
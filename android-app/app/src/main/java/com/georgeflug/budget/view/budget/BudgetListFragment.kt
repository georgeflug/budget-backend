package com.georgeflug.budget.view.budget

import android.app.Fragment
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import com.georgeflug.budget.view.budget.rollupmodel.BudgetRollup
import com.georgeflug.budget.view.budget.rollupmodel.MonthCategoryRollup
import com.georgeflug.budget.view.transaction.list.TransactionListFragment
import kotlinx.android.synthetic.main.fragment_budget_list.*
import java.time.LocalDate


class BudgetListFragment : Fragment() {
    var month: LocalDate? = null
        set(value) {
            field = value
            rePopulateBudgets()
        }
    private val budgets = BudgetRollup()
    lateinit var transactionsListFragment: TransactionListFragment
    private var isStopped = true

    override fun onCreateView(inflater: LayoutInflater, container: ViewGroup?,
                              savedInstanceState: Bundle?): View? {
        return inflater.inflate(com.georgeflug.budget.R.layout.fragment_budget_list, container, false)
    }

    override fun onStart() {
        super.onStart()

        isStopped = false

        budgetList.adapter = BudgetAdapter(context)
        rePopulateBudgets()

        budgets.setOnChangeListener(Runnable {
            rePopulateBudgets()
        })

        budgetList.setOnItemClickListener { parent, _, position, _ ->
            val dataMap = parent.adapter.getItem(position) as MonthCategoryRollup
            transactionsListFragment.filterBudget = dataMap.budget
            BudgetFragmentUtil.showAndAddToBackStack(transactionsListFragment)
        }
    }

    override fun onStop() {
        super.onStop()
        isStopped = true
        budgets.setOnChangeListener(null)
    }

    fun rePopulateBudgets() {
        val theMonth = month
        if (theMonth == null || isStopped) {
            return
        }
        (budgetList.adapter as BudgetAdapter).data = budgets.getMonth(theMonth).budgets.toList()
    }
}

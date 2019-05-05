package com.georgeflug.budget.view.budget

import android.app.Fragment
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.SimpleAdapter
import com.georgeflug.budget.R
import com.georgeflug.budget.model.Budget
import com.georgeflug.budget.view.transaction.list.TransactionListFragment
import kotlinx.android.synthetic.main.fragment_budget_list.*
import java.math.BigDecimal
import java.text.NumberFormat
import java.time.LocalDate

class BudgetListFragment : Fragment() {
    var month: LocalDate? = null
        set(value) {
            field = value
            rePopulateBudgets()
        }
    private val budgets = BudgetModel()
    private val visibleBudgets = mutableListOf<Map<String, String>>()
    lateinit var transactionsListFragment: TransactionListFragment
    private var isStopped = true

    override fun onCreateView(inflater: LayoutInflater, container: ViewGroup?,
                              savedInstanceState: Bundle?): View? {
        return inflater.inflate(R.layout.fragment_budget_list, container, false)
    }

    override fun onStart() {
        super.onStart()

        isStopped = false

        setUpBudgetListAdapter()
        rePopulateBudgets()

        budgets.setOnChangeListener(Runnable {
            rePopulateBudgets()
        })

        budgetList.setOnItemClickListener { parent, _, position, _ ->
            val dataMap = parent.adapter.getItem(position) as Map<String, String>
            transactionsListFragment.filterBudget = Budget.lookupOrUnknown(dataMap["title"] ?: "")
            BudgetFragmentUtil.showAndAddToBackStack(transactionsListFragment)
        }
    }

    override fun onStop() {
        super.onStop()
        isStopped = true
        budgets.setOnChangeListener(null)
    }

    fun setUpBudgetListAdapter() {
        val from = arrayOf("title", "allocated", "total", "iconId")
        val to = intArrayOf(R.id.budgetNameText, R.id.budgetAllocationText, R.id.budgetTotalText, R.id.budgetImage)
        budgetList.adapter = SimpleAdapter(context, visibleBudgets, R.layout.budget_item, from, to)
    }

    fun rePopulateBudgets() {
        val theMonth = month
        if (theMonth == null || isStopped) {
            return
        }

        val results = budgets.getMonth(theMonth).budgets.map { budget ->
            mapOf(
                    "title" to budget.title,
                    "total" to getTotalAmountText(budget),
                    "allocated" to getAllocatedText(budget),
                    "iconId" to budget.iconId.toString()
            )
        }

        val sorted = results.sortedBy {
            val prefix = if (it["allocated"] == null) "1" else "0"
            prefix + it["title"]
        }

        visibleBudgets.clear()
        visibleBudgets.addAll(sorted)

        (budgetList.adapter as SimpleAdapter).notifyDataSetChanged()
    }

    fun getTotalAmountText(budget: MonthCategoryRollup): String {
        val currencyFormatter = NumberFormat.getCurrencyInstance()
        return if (budget.total >= BigDecimal.ZERO) {
            currencyFormatter.format(budget.total)
        } else {
            "+" + currencyFormatter.format(-budget.total)
        }
    }

    fun getAllocatedText(budget: MonthCategoryRollup): String {
        if (budget.perMonth == BigDecimal.ZERO) {
            return ""
        }
        return "${budget.allocated} (${budget.perMonth} per month)"
    }
}

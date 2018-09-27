package com.georgeflug.budget.budgets

import android.os.Bundle
import android.support.v4.app.Fragment
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.SimpleAdapter
import android.widget.Toast
import com.georgeflug.budget.R
import com.georgeflug.budget.api.Transaction
import com.georgeflug.budget.api.TransactionApi
import kotlinx.android.synthetic.main.fragment_budgets.*
import java.math.BigDecimal

class BudgetsFragment : Fragment() {

    override fun onCreateView(inflater: LayoutInflater, container: ViewGroup?,
                              savedInstanceState: Bundle?): View? {
        return inflater.inflate(R.layout.fragment_budgets, container, false)
    }

    override fun onActivityCreated(savedInstanceState: Bundle?) {
        super.onActivityCreated(savedInstanceState)

        TransactionApi.getTransactions()
                .subscribe({
                    populateBudgets(it.rows)
                }, {
                    Toast.makeText(context, it.toString(), Toast.LENGTH_LONG).show()
                })
    }

    private fun populateBudgets(budgets: List<Transaction>) {
        val results = ArrayList<Map<String, String?>>()

        budgets.groupBy { it.budget }
                .forEach { budget: String, rows: List<Transaction> ->
                    val enumBudget = Budget.lookup(budget)
                    val total = rows.fold(BigDecimal.ZERO) { total, row -> total + row.amount }
                    results.add(mapOf(
                            "title" to budget,
                            "total" to total.toString(),
                            "allocated" to enumBudget?.amount?.toString(),
                            "iconId" to enumBudget?.iconId.toString()
                    ))
                }

        val sorted = results.sortedBy {
            val prefix = if (it["allocated"] == null) "1" else "0"
            prefix + it["title"]
        }

        val from = arrayOf("title", "allocated", "total", "iconId")
        val to = intArrayOf(R.id.budgetNameText, R.id.budgetAllocationText, R.id.budgetTotalText, R.id.budgetImage)
        budgetList.adapter = SimpleAdapter(context, sorted, R.layout.budget_item, from, to)
    }
}

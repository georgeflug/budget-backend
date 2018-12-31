package com.georgeflug.budget.budgets

import android.os.Bundle
import android.support.v4.app.Fragment
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.AdapterView
import android.widget.SimpleAdapter
import android.widget.Toast
import com.georgeflug.budget.R
import com.georgeflug.budget.api.Transaction
import com.georgeflug.budget.api.TransactionApi
import kotlinx.android.synthetic.main.fragment_budgets.*
import java.math.BigDecimal
import java.text.NumberFormat
import java.time.LocalDate
import java.time.Month
import java.time.format.DateTimeFormatter
import java.util.*

class BudgetsFragment : Fragment() {

    private lateinit var transactions: List<Transaction>

    override fun onCreateView(inflater: LayoutInflater, container: ViewGroup?,
                              savedInstanceState: Bundle?): View? {
        return inflater.inflate(R.layout.fragment_budgets, container, false)
    }

    override fun onActivityCreated(savedInstanceState: Bundle?) {
        super.onActivityCreated(savedInstanceState)

        // TODO: when I edit a transaction, those changes are not reflected here.
        // add a repo layer or something.

        TransactionApi.getTransactions()
                .subscribe({
                    transactions = it.rows
                    rePopulateBudgets()
                }, {
                    Toast.makeText(context, it.toString(), Toast.LENGTH_LONG).show()
                })
        budgetList.setOnItemClickListener { adapterView: AdapterView<*>, view1: View, i: Int, l: Long ->
            rePopulateBudgets()
        }

        // add budget tabs for every month ever since the app began
        var month = LocalDate.of(2018, Month.AUGUST, 1)
        val lastMonth = LocalDate.now()
        val monthFormat = DateTimeFormatter.ofPattern("MMM", Locale.US)
        val monthAndYearFormat = DateTimeFormatter.ofPattern("MMM YYYY", Locale.US)
        while (month <= lastMonth) {
            val tabText = if (month.year != lastMonth.year) {
                monthAndYearFormat.format(month)
            } else {
                monthFormat.format(month)
            }
            tabLayout.addTab(tabLayout.newTab().setText(tabText))
            month = month.plusMonths(1)
        }
    }

    fun rePopulateBudgets() {
        val results = ArrayList<Map<String, String?>>()

        val formatter = NumberFormat.getCurrencyInstance()

        transactions.groupBy { it.budget }
                .forEach { budget: String, rows: List<Transaction> ->
                    val enumBudget = Budget.lookup(budget)
                    val total = rows.fold(BigDecimal.ZERO) { total, row -> total + row.amount }
                    results.add(mapOf(
                            "title" to budget,
                            "total" to formatter.format(total),
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

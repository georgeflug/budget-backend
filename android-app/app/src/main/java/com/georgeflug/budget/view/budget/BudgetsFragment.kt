package com.georgeflug.budget.view.budget

import android.os.Bundle
import android.os.Handler
import android.support.design.widget.TabLayout
import android.support.v4.app.Fragment
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.SimpleAdapter
import com.georgeflug.budget.R
import com.georgeflug.budget.api.BudgetApi
import com.georgeflug.budget.model.Budget
import com.georgeflug.budget.model.Transaction
import com.georgeflug.budget.model.TransactionSplit
import com.georgeflug.budget.util.AlertUtil
import com.georgeflug.budget.util.DateUtil
import io.reactivex.android.schedulers.AndroidSchedulers
import kotlinx.android.synthetic.main.fragment_budgets.*
import java.math.BigDecimal
import java.text.NumberFormat
import java.time.LocalDate
import java.time.Period

class BudgetsFragment : Fragment() {

    private var transactions: List<Transaction> = ArrayList()
    private var selectedTab = -1

    override fun onCreateView(inflater: LayoutInflater, container: ViewGroup?,
                              savedInstanceState: Bundle?): View? {
        return inflater.inflate(R.layout.fragment_budgets, container, false)
    }

    override fun onStart() {
        super.onStart()

        BudgetMonths().getBudgetMonths().forEach {
            val tab = tabLayout.newTab()
                    .setText(it.name)
                    .setTag(it.month)
            tabLayout.addTab(tab)
        }
        preselectTab()

        BudgetApi.transactions.listTransactions()
                .observeOn(AndroidSchedulers.mainThread())
                .subscribe({
                    transactions = it
                    rePopulateBudgets(LocalDate.now())
                }, {
                    AlertUtil.showError(context, it, "Could not retrieve transaction list")
                })

        budgetList.setOnItemClickListener { _, _, _, _ ->
            rePopulateBudgets(LocalDate.now())
        }

        tabLayout.addOnTabSelectedListener(object : TabLayout.OnTabSelectedListener {
            override fun onTabReselected(tab: TabLayout.Tab) {}
            override fun onTabUnselected(tab: TabLayout.Tab) {}
            override fun onTabSelected(tab: TabLayout.Tab) {
                val month: LocalDate = tab.tag as LocalDate
                rePopulateBudgets(month)
                selectedTab = tab.position
            }
        })

    }

    private fun preselectTab() {
        if (selectedTab == -1) selectedTab = tabLayout.tabCount - 1
        Handler().postDelayed({
            tabLayout.getTabAt(selectedTab)!!.select()
        }, 50)
    }

    fun rePopulateBudgets(month: LocalDate) {
        val results = ArrayList<Map<String, String?>>()
        var carryovers = HashMap<Budget, BigDecimal>()

        val currencyFormatter = NumberFormat.getCurrencyInstance()

        val monthCount = BigDecimal.valueOf(Period.between(month, DateUtil.firstDay).months.toLong())

        // carry-forward earlier budget amounts
        transactions
                .filter { isBeforeMonth(DateUtil.parseDate(it.getBestDate()), month) }
                .flatMap { transaction -> transaction.splits }
                .groupBy { it.budget }
                .forEach { budget: String, rows: List<TransactionSplit> ->
                    val enumBudget = Budget.lookup(budget)
                    if (enumBudget?.amount != null) {
                        val totalSpent = rows.fold(BigDecimal.ZERO) { total, row -> total + row.amount }.negate()
                        val totalAllocated = enumBudget.amount.negate() * monthCount
                        carryovers[enumBudget] = totalAllocated - totalSpent
                    }
                }

        // get budgets for the current month
        transactions
                .filter { isSameMonth(DateUtil.parseDate(it.getBestDate()), month) }
                .flatMap { transaction -> transaction.splits }
                .groupBy { it.budget }
                .forEach { budget: String, rows: List<TransactionSplit> ->
                    val enumBudget = Budget.lookup(budget)
                    val total = rows.fold(BigDecimal.ZERO) { total, row -> total + row.amount }.negate()
                    val carryOver = carryovers[enumBudget]
                    results.add(mapOf(
                            "title" to budget,
                            "total" to currencyFormatter.format(total),
                            "allocated" to getAllocatedText(enumBudget, carryOver),
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

    fun isSameMonth(firstDate: LocalDate, secondDate: LocalDate): Boolean {
        return firstDate.month == secondDate.month && firstDate.year == secondDate.year
    }

    fun isBeforeMonth(firstDate: LocalDate, secondDate: LocalDate): Boolean {
        return firstDate.monthValue < secondDate.monthValue || firstDate.year < secondDate.year
    }

    fun getAllocatedText(budget: Budget?, carryOver: BigDecimal?): String? {
        return when {
            carryOver == null -> budget?.amount?.toString()
            else -> budget!!.amount!!.toString() + when {
                carryOver >= BigDecimal.ZERO -> " + " + carryOver.toString()
                else -> " - " + carryOver.negate().toString()
            } + " = " + (budget!!.amount!! + carryOver).toString()
        }
    }
}

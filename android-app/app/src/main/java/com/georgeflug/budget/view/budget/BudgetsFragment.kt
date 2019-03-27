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
import kotlinx.android.synthetic.main.fragment_budgets.*
import java.math.BigDecimal
import java.text.NumberFormat
import java.time.LocalDate

class BudgetsFragment : Fragment() {
    private var selectedTab = -1
    private val budgets = BudgetModel()

    override fun onCreateView(inflater: LayoutInflater, container: ViewGroup?,
                              savedInstanceState: Bundle?): View? {
        return inflater.inflate(R.layout.fragment_budgets, container, false)
    }

    override fun onStart() {
        super.onStart()

        BudgetTabModel().getBudgetMonths().forEach {
            val tab = tabLayout.newTab()
                    .setText(it.name)
                    .setTag(it.month)
            tabLayout.addTab(tab)
        }
        preselectTab()

        rePopulateBudgets(LocalDate.now())

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
        val currencyFormatter = NumberFormat.getCurrencyInstance()

        val results = budgets.getMonth(month).budgets.map { budget ->
            mapOf(
                    "title" to budget.title,
                    "total" to currencyFormatter.format(budget.total),
                    "allocated" to getAllocatedText(budget),
                    "iconId" to budget.iconId.toString()
            )
        }

        val sorted = results.sortedBy {
            val prefix = if (it["allocated"] == null) "1" else "0"
            prefix + it["title"]
        }

        val from = arrayOf("title", "allocated", "total", "iconId")
        val to = intArrayOf(R.id.budgetNameText, R.id.budgetAllocationText, R.id.budgetTotalText, R.id.budgetImage)
        budgetList.adapter = SimpleAdapter(context, sorted, R.layout.budget_item, from, to)
    }

    fun getAllocatedText(budget: MonthCategoryRollup): String {
        if (budget.perMonth == BigDecimal.ZERO) {
            return ""
        }
        return "${budget.allocated} (${budget.perMonth} per month)"
    }
}
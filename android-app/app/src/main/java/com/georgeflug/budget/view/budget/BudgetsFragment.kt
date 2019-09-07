package com.georgeflug.budget.view.budget

import android.app.Fragment
import android.os.Bundle
import android.os.Handler
import android.support.design.widget.TabLayout
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import com.georgeflug.budget.R
import com.georgeflug.budget.view.budget.tabmodel.BudgetTabModel
import com.georgeflug.budget.view.transaction.list.TransactionListFragment
import kotlinx.android.synthetic.main.fragment_budgets.*
import java.time.LocalDate

class BudgetsFragment : Fragment() {
    private var selectedTab = -1
    private val budgetListFragment = BudgetListFragment()
    private val transactionsListFragment = TransactionListFragment()

    init {
        budgetListFragment.transactionsListFragment = transactionsListFragment
    }

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

        tabLayout.addOnTabSelectedListener(object : TabLayout.OnTabSelectedListener {
            override fun onTabReselected(tab: TabLayout.Tab) {}
            override fun onTabUnselected(tab: TabLayout.Tab) {}
            override fun onTabSelected(tab: TabLayout.Tab) {
                budgetListFragment.month = tab.tag as LocalDate
                transactionsListFragment.filterMonth = (tab.tag as LocalDate).monthValue
                selectedTab = tab.position
            }
        })

        preselectTab()
    }

    override fun onResume() {
        super.onResume()
        BudgetFragmentUtil.showAndAddToBackStack(budgetListFragment)
    }

    private fun preselectTab() {
        if (selectedTab == -1) selectedTab = tabLayout.tabCount - 1
        Handler().postDelayed({
            tabLayout.getTabAt(selectedTab)!!.select()
        }, 50)
    }
}

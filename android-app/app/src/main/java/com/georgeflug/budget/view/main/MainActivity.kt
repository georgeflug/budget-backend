package com.georgeflug.budget.view.main

import android.app.Activity
import android.app.Fragment
import android.app.FragmentManager
import android.graphics.drawable.LayerDrawable
import android.os.Bundle
import android.support.design.internal.BottomNavigationMenuView
import android.support.design.widget.BottomNavigationView
import android.support.v7.app.AppCompatActivity
import android.util.Log
import android.util.TypedValue
import android.view.Menu
import android.view.MenuItem
import android.view.View
import android.view.inputmethod.InputMethodManager
import com.georgeflug.budget.R
import com.georgeflug.budget.service.PersistedTransactionService
import com.georgeflug.budget.view.budget.BudgetsFragment
import com.georgeflug.budget.view.feature.SuggestAFeatureDialog
import com.georgeflug.budget.view.transaction.add.AddTransactionFragment
import com.georgeflug.budget.view.transaction.list.TransactionListFragment
import kotlinx.android.synthetic.main.activity_main.*


class MainActivity : AppCompatActivity() {
    companion object {
        val backStack = mapOf<Int, MutableList<Fragment>>(
                R.id.nav_add to mutableListOf(),
                R.id.nav_budgets to mutableListOf(),
                R.id.nav_transactions to mutableListOf()
        )

        var currentTab: Int = 0

        lateinit var fragmentManager: FragmentManager
        private lateinit var bottomNav: BottomNavigationView

        fun addToBackStack(fragment: Fragment) {
            val currentBackStack = backStack[currentTab]
            currentBackStack?.add(fragment)
        }

        fun popFromBackStack() {
            val currentBackStack = backStack[currentTab]
            if (currentBackStack != null && currentBackStack.size > 0) {
                currentBackStack.removeAt(currentBackStack.size - 1)
            }
        }

        fun backStackSize() = backStack[currentTab]?.size ?: 0

        fun updateTransactionCount(count: Int) {
            Log.d("MainActivity", "Setting Red Transaction Count to: $count");
            val icon = bottomNav.menu.findItem(R.id.nav_transactions).icon as LayerDrawable
            Count.setCounting(icon, count)
            bottomNav.invalidate()
        }
    }

    private val countModel = CountModel()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        MainActivity.fragmentManager = fragmentManager

        setSupportActionBar(toolbar)
        supportActionBar?.setDisplayShowHomeEnabled(true)
        supportActionBar?.title = "Add Transaction"

        initializeRedTransactionBadge()

        val addTransactionsFragment = AddTransactionFragment()
        val listTransactionsFragment = TransactionListFragment()
        val budgetsFragment = BudgetsFragment()

        bottomNav.setOnNavigationItemSelectedListener {
            currentTab = it.itemId

            fragmentManager.popBackStack(null, FragmentManager.POP_BACK_STACK_INCLUSIVE)

            showFragment(when (it.itemId) {
                R.id.nav_add -> addTransactionsFragment
                R.id.nav_budgets -> budgetsFragment
                else -> listTransactionsFragment
            })

            supportActionBar?.title = when (it.itemId) {
                R.id.nav_add -> "Add Transaction"
                R.id.nav_transactions -> "Transactions"
                R.id.nav_budgets -> "Budgets"
                else -> "Budget"
            }

            val currentBackStack = backStack[it.itemId]
            currentBackStack?.forEach { fragment -> showFragmentWithBackStack(fragment) }

            val imm = getSystemService(Activity.INPUT_METHOD_SERVICE) as InputMethodManager
            imm.hideSoftInputFromWindow(window.decorView.rootView.windowToken, 0)
            true
        }

        bottomNav.selectedItemId = R.id.nav_transactions
        showFragment(listTransactionsFragment)
    }

    private fun initializeRedTransactionBadge() {
        val menuView = bottomNav.getChildAt(0) as BottomNavigationMenuView
        val iconView = menuView.getChildAt(1).findViewById<View>(android.support.design.R.id.icon)
        val layoutParams = iconView.layoutParams
        val displayMetrics = resources.displayMetrics
        layoutParams.width = TypedValue.applyDimension(TypedValue.COMPLEX_UNIT_DIP, 48f, displayMetrics).toInt()

        MainActivity.bottomNav = bottomNav
        updateTransactionCount(0)
    }

    override fun onBackPressed() {
        super.onBackPressed()

        val currentBackStack = backStack[bottomNav.selectedItemId]
        if (currentBackStack != null && currentBackStack.size > 0) {
            currentBackStack.removeAt(currentBackStack.size - 1)
        }
    }

    override fun onCreateOptionsMenu(menu: Menu): Boolean {
        menuInflater.inflate(R.menu.options_menu, menu)
        return true
    }

    override fun onOptionsItemSelected(item: MenuItem): Boolean {
        // Handle item selection
        return when (item.itemId) {
            R.id.option_feature_idea -> {
                suggestAFeature()
                true
            }
            R.id.option_clear_cache -> {
                clearCache()
                true
            }
            else -> super.onOptionsItemSelected(item)
        }
    }

    private fun showFragment(fragment: Fragment) {
        fragmentManager
                .beginTransaction()
                .replace(R.id.fragmentContainer, fragment)
                .commit()
    }

    private fun showFragmentWithBackStack(fragment: Fragment) {
        fragmentManager
                .beginTransaction()
                .replace(R.id.fragmentContainer, fragment)
                .addToBackStack(null)
                .commit()
    }

    private fun suggestAFeature() {
        SuggestAFeatureDialog(this).show()
    }

    private fun clearCache() {
        PersistedTransactionService.clearCache()
    }
}

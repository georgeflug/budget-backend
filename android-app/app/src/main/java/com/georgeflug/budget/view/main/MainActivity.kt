package com.georgeflug.budget.view.main

import android.app.Activity
import android.os.Bundle
import android.support.v4.app.Fragment
import android.support.v7.app.AppCompatActivity
import android.view.Menu
import android.view.MenuItem
import android.view.inputmethod.InputMethodManager
import com.georgeflug.budget.R
import com.georgeflug.budget.view.budget.BudgetsFragment
import com.georgeflug.budget.view.feature.SuggestAFeatureDialog
import com.georgeflug.budget.view.transaction.add.AddTransactionFragment
import com.georgeflug.budget.view.transaction.list.TransactionsFragment
import kotlinx.android.synthetic.main.activity_main.*


class MainActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        setSupportActionBar(toolbar)
        supportActionBar?.setDisplayShowHomeEnabled(true)
        supportActionBar?.title = "Add Transaction"

        val addTransactionsFragment = AddTransactionFragment()
        val listTransactionsFragment = TransactionsFragment()
        val budgetsFragment = BudgetsFragment()

        bottomNav.setOnNavigationItemSelectedListener {
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

            val imm = getSystemService(Activity.INPUT_METHOD_SERVICE) as InputMethodManager
            imm.hideSoftInputFromWindow(window.decorView.rootView.windowToken, 0)
            true
        }

        bottomNav.selectedItemId = R.id.nav_transactions
        showFragment(listTransactionsFragment)
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
            else -> super.onOptionsItemSelected(item)
        }
    }

    private fun showFragment(fragment: Fragment) {
        getSupportFragmentManager()
                .beginTransaction()
                .replace(R.id.fragmentContainer, fragment)
                .commit()
    }

    private fun suggestAFeature() {
        SuggestAFeatureDialog(this).show()
    }
}

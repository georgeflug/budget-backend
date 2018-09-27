package com.georgeflug.budget

import android.os.Bundle
import android.support.v7.app.AppCompatActivity
import android.view.Menu
import android.view.MenuItem
import android.view.View
import kotlinx.android.synthetic.main.activity_main.*


class MainActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        setSupportActionBar(toolbar)
        supportActionBar?.setDisplayShowHomeEnabled(true)
        supportActionBar?.title = "Add Transaction"

        bottomNav.setOnNavigationItemSelectedListener {
            addTransactionFragmentContainer.visibility = if (it.itemId == R.id.nav_add) View.VISIBLE else View.GONE
            transactionsFragmentContainer.visibility = if (it.itemId == R.id.nav_transactions) View.VISIBLE else View.GONE
            budgetsFragmentContainer.visibility = if (it.itemId == R.id.nav_budgets) View.VISIBLE else View.GONE
            supportActionBar?.title = when (it.itemId) {
                R.id.nav_add -> "Add Transaction"
                R.id.nav_transactions -> "Transactions"
                R.id.nav_budgets -> "Budgets"
                else -> "Budget"
            }
            true
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
            else -> super.onOptionsItemSelected(item)
        }
    }

    private fun suggestAFeature() {
        SuggestAFeatureDialog(this).show()
    }
}

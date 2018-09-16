package com.georgeflug.budget

import android.support.v7.app.AppCompatActivity
import android.os.Bundle
import android.widget.SimpleAdapter
import kotlinx.android.synthetic.main.activity_main.*

class MainActivity : AppCompatActivity() {

    val budgets = listOf("Richie", "Stef", "Ben", "Big Necessities", "Charity", "Clothes - Stef", "Clothes - Richie", "Entertainment", "Groceries", "Mortgage", "Optional Important", "Gifts", "Christmas", "Richie - Projects", "Student Loan", "Subscriptions", "Home Supplies", "Travel", "Utilities")
    val descriptions = listOf("", "", "", "Health bills, car repairs, house repairs", "", "Clothes, hair, makeup", "", "Restaurants, bars, food, movies, outings, etc", "", "", "Gifts, optional house improvements, Christmas cards & gifts, photo books", "", "", "", "", "Insurance, Netflix, Amazon, Gym", "", "", "Internet, Phones, Electric, Water, Trash")

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)
        prepareBudgetSpinner()
    }

    private fun prepareBudgetSpinner() {
        val items = budgets.mapIndexed { index, budget -> mutableMapOf("budget" to budget, "description" to descriptions[index]) }
                .sortedBy { it["budget"] }
                .toMutableList()
        val from = arrayOf("budget", "description")
        val to = intArrayOf(R.id.line1, R.id.line2)
        budgetText.adapter = SimpleAdapter(this, items, R.layout.spinner_two_lines, from, to)
    }
}

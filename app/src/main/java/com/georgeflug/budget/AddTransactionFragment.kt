package com.georgeflug.budget

import android.os.Bundle
import android.support.v4.app.Fragment
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.SimpleAdapter
import android.widget.Toast
import kotlinx.android.synthetic.main.fragment_add_transaction.*
import java.math.BigDecimal
import java.text.SimpleDateFormat
import java.util.*

class AddTransactionFragment : Fragment() {

    private val budgets = listOf("Richie", "Stef", "Ben", "Big Necessities", "Charity", "Clothes - Stef", "Clothes - Richie", "Entertainment", "Groceries", "Mortgage", "Optional Important", "Gifts", "Christmas", "Richie - Projects", "Student Loan", "Subscriptions", "Home Supplies", "Travel", "Utilities")
    private val descriptions = listOf("", "", "", "Health bills, car repairs, house repairs", "", "Clothes, hair, makeup", "", "Restaurants, bars, food, movies, outings, etc", "", "", "Gifts, optional house improvements, Christmas cards & gifts, photo books", "", "", "", "", "Insurance, Netflix, Amazon, Gym", "", "", "Internet, Phones, Electric, Water, Trash")

    override fun onCreateView(inflater: LayoutInflater, container: ViewGroup?,
                              savedInstanceState: Bundle?): View? {
        return inflater.inflate(R.layout.fragment_add_transaction, container, false)
    }

    override fun onActivityCreated(savedInstanceState: Bundle?) {
        super.onActivityCreated(savedInstanceState)
        prepareBudgetSpinner()
        submitTransactionButton.setOnClickListener {
            val amount = BigDecimal(amountText.text.toString())
            val description = descriptionText.text.toString()
            val budget = (budgetText.selectedItem as HashMap<String, String>)["budget"]
            val date = SimpleDateFormat("MM-dd-yyyy").format(Date())
            TransactionRepo.addTransaction(date, amount.toString(), budget!!, description)
                    .subscribe({
                        Toast.makeText(context, "Success!", Toast.LENGTH_LONG).show()
                        amountText.setText("")
                        descriptionText.setText("")
                        amountText.requestFocus()
                    }, {
                        Toast.makeText(context, it.toString(), Toast.LENGTH_LONG).show()
                    })
        }
    }

    private fun prepareBudgetSpinner() {
        val items = budgets.mapIndexed { index, budget -> mutableMapOf("budget" to budget, "description" to descriptions[index]) }
                .sortedBy { it["budget"] }
                .toMutableList()
        val from = arrayOf("budget", "description")
        val to = intArrayOf(R.id.line1, R.id.line2)
        budgetText.adapter = SimpleAdapter(context, items, R.layout.spinner_two_lines, from, to)
    }
}

package com.georgeflug.budget.transactions

import android.content.Context
import android.graphics.Color
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ArrayAdapter
import android.widget.TextView
import com.georgeflug.budget.R
import com.georgeflug.budget.R.id.*
import com.georgeflug.budget.api.Transaction
import com.georgeflug.budget.budgets.Budget
import java.text.NumberFormat

class SplitTransactionAdapter(context: Context, private val list: List<Transaction>) : ArrayAdapter<Transaction>(context, 0, list) {

    override fun getView(position: Int, convertView: View?, parent: ViewGroup): View {
        val transaction = list[position]
        val view = convertView
                ?: LayoutInflater.from(context).inflate(R.layout.split_item, parent, false)

        view.findViewById<View>(splitItem).setBackgroundColor(getColor(transaction))
        view.findViewById<TextView>(splitItemText).text = getDescription(transaction)
        view.findViewById<TextView>(splitItemAmount).text = NumberFormat.getCurrencyInstance().format(transaction.amount)

        return view
    }

    private fun getDescription(transaction: Transaction): String {
        return when {
            transaction.budget.isBlank() -> transaction.description
            transaction.description.isBlank() -> transaction.budget
            else -> "${transaction.budget} - ${transaction.description}"
        }
    }

    private fun getColor(transaction: Transaction): Int {
        return Color.parseColor(when {
            transaction.budget.isBlank() -> "#ff9e80" // red
            transaction.budget == Budget.UNKNOWN.title -> "#42a5f5" // blue
            else -> "#ffffff"
        })
    }

}
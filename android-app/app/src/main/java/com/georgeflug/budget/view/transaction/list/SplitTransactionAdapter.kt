package com.georgeflug.budget.view.transaction.list

import android.content.Context
import android.graphics.Color
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ArrayAdapter
import android.widget.TextView
import com.georgeflug.budget.R
import com.georgeflug.budget.R.id.splitItem
import com.georgeflug.budget.R.id.splitItemAmount
import com.georgeflug.budget.R.id.splitItemText
import com.georgeflug.budget.model.Budget
import com.georgeflug.budget.model.TransactionSplit
import java.text.NumberFormat

class SplitTransactionAdapter(context: Context, private val list: List<TransactionSplit>) : ArrayAdapter<TransactionSplit>(context, 0, list) {

    override fun getView(position: Int, convertView: View?, parent: ViewGroup): View {
        val split = list[position]
        val view = convertView
                ?: LayoutInflater.from(context).inflate(R.layout.split_item, parent, false)

        view.findViewById<View>(splitItem).setBackgroundColor(getColor(split))
        view.findViewById<TextView>(splitItemText).text = getDescription(split)
        view.findViewById<TextView>(splitItemAmount).text = NumberFormat.getCurrencyInstance().format(split.amount)

        return view
    }

    private fun getDescription(split: TransactionSplit): String {
        return when {
            split.budget.isBlank() -> split.description
            split.description.isBlank() -> split.budget
            else -> "${split.budget} - ${split.description}"
        }
    }

    private fun getColor(split: TransactionSplit): Int {
        return Color.parseColor(when {
            split.budget.isBlank() -> "#ff9e80" // red
            split.budget == Budget.UNKNOWN.title -> "#42a5f5" // blue
            else -> "#ffffff"
        })
    }

}
package com.georgeflug.budget.transactions

import android.content.Context
import android.graphics.Color
import android.text.Html
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ArrayAdapter
import android.widget.ListView
import android.widget.TextView
import com.georgeflug.budget.R
import com.georgeflug.budget.R.id.*
import com.georgeflug.budget.budgets.Budget
import java.text.NumberFormat

class TransactionAdapter(context: Context, private val list: List<SplittableTransaction>) : ArrayAdapter<SplittableTransaction>(context, 0, list) {
    override fun getViewTypeCount() = 3

    override fun getItemViewType(position: Int): Int {
        val transaction = list[position]
        return when {
            transaction.account == "SECTION" -> 0
            transaction.splits.isEmpty() -> 1
            else -> 2
        }
    }

    override fun getView(position: Int, convertView: View?, parent: ViewGroup): View {
        val transaction = list[position]
        return when {
            transaction.account == "SECTION" -> getSectionView(transaction, convertView, parent)
            transaction.splits.isEmpty() -> getItemView(transaction, convertView, parent)
            else -> getSplitItemView(transaction, convertView, parent)
        }
    }

    private fun getSectionView(transaction: SplittableTransaction, convertView: View?, parent: ViewGroup): View {
        val view = convertView
                ?: LayoutInflater.from(context).inflate(R.layout.transaction_section_item, parent, false)

        val itemDescriptionTextView = view.findViewById<TextView>(itemDescriptionText)
        itemDescriptionTextView.text = Html.fromHtml("<b>" + getDescription(transaction) + "</b>", 0)

        return view
    }

    private fun getItemView(transaction: SplittableTransaction, convertView: View?, parent: ViewGroup): View {
        val view = convertView
                ?: LayoutInflater.from(context).inflate(R.layout.transaction_item, parent, false)

        view.findViewById<View>(transactionItem).setBackgroundColor(getColor(transaction))
        view.findViewById<TextView>(itemDescriptionText).text = getDescription(transaction)
        view.findViewById<TextView>(itemBudgetText).text = transaction.budget
        view.findViewById<TextView>(itemAccountText).text = getAccount(transaction)
        view.findViewById<TextView>(itemAmountText).text = NumberFormat.getCurrencyInstance().format(transaction.amount)

        return view
    }

    private fun getSplitItemView(transaction: SplittableTransaction, convertView: View?, parent: ViewGroup): View {
        val view = convertView
                ?: LayoutInflater.from(context).inflate(R.layout.transaction_split_item, parent, false)

        view.findViewById<View>(transactionItem).setBackgroundColor(Color.WHITE)
        view.findViewById<TextView>(itemDescriptionText).text = getDescription(transaction)
        view.findViewById<TextView>(itemAmountText).text = NumberFormat.getCurrencyInstance().format(transaction.amount)
        view.findViewById<ListView>(splitItemList).adapter = SplitTransactionAdapter(context, transaction.splits)

        return view
    }

    private fun getDescription(transaction: SplittableTransaction): String {
        return when {
            transaction.isPartial() -> transaction.description
            transaction.description.isBlank() -> transaction.postedDescription
            transaction.postedDescription.isBlank() -> transaction.description
            else -> "${transaction.description}\n${transaction.postedDescription}"
        }
    }

    private fun getAccount(transaction: SplittableTransaction): String {
        return when {
            transaction.isPartial() -> ""
            transaction.account == "First Community Checking" -> "Checking"
            else -> transaction.account
        }
    }

    private fun getColor(transaction: SplittableTransaction): Int {
        return Color.parseColor(when {
            transaction.budget.isBlank() -> "#ff9e80" // red
            transaction.budget == Budget.UNKNOWN.title -> "#42a5f5" // blue
            transaction.account.isBlank() -> "#ffe57f" // yellow
            else -> "#ffffff"
        })
    }

}
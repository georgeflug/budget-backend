package com.georgeflug.budget.transactions

import android.content.Context
import android.graphics.Color
import android.text.Html
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

class TransactionAdapter(context: Context, private val list: List<Transaction>) : ArrayAdapter<Transaction>(context, 0, list) {

    override fun getView(position: Int, convertView: View?, parent: ViewGroup): View {
        var view = convertView ?: LayoutInflater.from(context).inflate(R.layout.transaction_item, parent, false)
        val transaction = list[position]

        val transactionItemView = view.findViewById<View>(transactionItem)
        val itemDescriptionTextView = view.findViewById<TextView>(itemDescriptionText)
        val itemBudgetTextView = view.findViewById<TextView>(itemBudgetText)
        val itemAccountTextView = view.findViewById<TextView>(itemAccountText)
        val itemAmountTextView = view.findViewById<TextView>(itemAmountText)

        if (transaction.account == "SECTION") {
            itemDescriptionTextView.text = Html.fromHtml("<b>" + getDescription(transaction) + "</b>", 0)
            // definitely zero out everything due to views being recycled.
            itemBudgetTextView.visibility = View.GONE
            itemAccountTextView.visibility = View.GONE
            itemAmountTextView.text = ""
            transactionItemView.setBackgroundColor(Color.parseColor("#ffffff"))
        } else {
            itemDescriptionTextView.text = getDescription(transaction)
            itemBudgetTextView.visibility = View.VISIBLE
            itemAccountTextView.visibility = View.VISIBLE
            itemBudgetTextView.text = transaction.budget
            itemAccountTextView.text = getAccount(transaction.account)
            itemAmountTextView.text = NumberFormat.getCurrencyInstance().format(transaction.amount)

            if (transaction.budget.isBlank()) {
                transactionItemView.setBackgroundColor(Color.parseColor("#ff9e80")) // red
            } else if (transaction.budget == Budget.UNKNOWN.title) {
                transactionItemView.setBackgroundColor(Color.parseColor("#42a5f5")) // blue
            } else if (transaction.account.isBlank()) {
                transactionItemView.setBackgroundColor(Color.parseColor("#ffe57f")) // yellow
            } else {
                transactionItemView.setBackgroundColor(Color.parseColor("#ffffff"))
            }
        }

        return view
    }

    private fun getDescription(transaction: Transaction): String {
        return when {
            transaction.description.isBlank() -> transaction.postedDescription
            transaction.postedDescription.isBlank() -> transaction.description
            else -> "${transaction.description}\n${transaction.postedDescription}"
        }
    }

    private fun getAccount(fullAccountName: String): String {
        return when (fullAccountName) {
            "First Community Checking" -> "Checking"
            else -> fullAccountName
        }
    }

}
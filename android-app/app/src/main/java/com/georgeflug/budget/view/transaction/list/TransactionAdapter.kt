package com.georgeflug.budget.view.transaction.list

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
import com.georgeflug.budget.R.id.itemAccountText
import com.georgeflug.budget.R.id.itemAmountText
import com.georgeflug.budget.R.id.itemBudgetText
import com.georgeflug.budget.R.id.itemDescriptionText
import com.georgeflug.budget.R.id.splitItemList
import com.georgeflug.budget.R.id.transactionItem
import com.georgeflug.budget.model.Budget
import com.georgeflug.budget.model.Transaction
import java.text.NumberFormat

class TransactionAdapter(
        context: Context,
        private val model: TransactionsModel = TransactionsModel())
    : ArrayAdapter<TransactionsModel.SectionOrTransaction>(context, 0, model.items) {

    init {
        model.registerOnChange(Runnable {
            this.notifyDataSetInvalidated()
        })
    }

    override fun getViewTypeCount() = 3

    override fun getItemViewType(position: Int): Int {
        val item = model.getSectionOrTransactionAt(position)
        return when {
            isSection(item) -> 0
            isUnsplitTransaction(item) -> 1
            else -> 2
        }
    }

    override fun getView(position: Int, convertView: View?, parent: ViewGroup): View {
        val item = model.getSectionOrTransactionAt(position)
        return when {
            isSection(item) -> getSectionView(item.section!!, convertView, parent)
            isUnsplitTransaction(item) -> getItemView(item.transaction!!, convertView, parent)
            else -> getSplitItemView(item.transaction!!, convertView, parent)
        }
    }

    private fun isSection(item: TransactionsModel.SectionOrTransaction) = item.section != null
    private fun isUnsplitTransaction(item: TransactionsModel.SectionOrTransaction) = item.transaction!!.splits.size == 1

    private fun getSectionView(section: Section, convertView: View?, parent: ViewGroup): View {
        val view = convertView
                ?: LayoutInflater.from(context).inflate(R.layout.transaction_section_item, parent, false)

        val itemDescriptionTextView = view.findViewById<TextView>(itemDescriptionText)
        itemDescriptionTextView.text = Html.fromHtml("<b>${section.name}</b>", 0)

        return view
    }

    private fun getItemView(transaction: Transaction, convertView: View?, parent: ViewGroup): View {
        val view = convertView
                ?: LayoutInflater.from(context).inflate(R.layout.transaction_item, parent, false)

        view.findViewById<View>(transactionItem).setBackgroundColor(getColor(transaction))
        view.findViewById<TextView>(itemDescriptionText).text = getDescription(transaction)
        view.findViewById<TextView>(itemBudgetText).text = transaction.splits[0].budget
        view.findViewById<TextView>(itemAccountText).text = getAccount(transaction)
        view.findViewById<TextView>(itemAmountText).text = NumberFormat.getCurrencyInstance().format(transaction.totalAmount)

        return view
    }

    private fun getSplitItemView(transaction: Transaction, convertView: View?, parent: ViewGroup): View {
        val view = convertView
                ?: LayoutInflater.from(context).inflate(R.layout.transaction_split_item, parent, false)

        view.findViewById<View>(transactionItem).setBackgroundColor(Color.WHITE)
        view.findViewById<TextView>(itemDescriptionText).text = getDescription(transaction)
        view.findViewById<TextView>(itemAmountText).text = NumberFormat.getCurrencyInstance().format(transaction.totalAmount)
        view.findViewById<ListView>(splitItemList).adapter = SplitTransactionAdapter(context, transaction.splits)

        return view
    }

    private fun getDescription(transaction: Transaction): String? {
        return when {
            transaction.splits[0].description.isBlank() -> transaction.postedDescription
            transaction.postedDescription?.isBlank() == true -> transaction.splits[0].description
            else -> "${transaction.splits[0].description}\n${transaction.postedDescription}"
        }
    }

    private fun getAccount(transaction: Transaction): String {
        return when {
            transaction.account == "First Community Checking" -> "Checking"
            else -> transaction.account
        }
    }

    private fun getColor(transaction: Transaction): Int {
        return Color.parseColor(when {
            transaction.splits[0].budget.isBlank() -> "#ff9e80" // red
            transaction.splits[0].budget == Budget.UNKNOWN.title -> "#42a5f5" // blue
            transaction.account.isBlank() -> "#ffe57f" // yellow
            else -> "#ffffff"
        })
    }

}
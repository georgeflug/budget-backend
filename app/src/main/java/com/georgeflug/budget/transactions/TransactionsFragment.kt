package com.georgeflug.budget.transactions

import android.os.Bundle
import android.support.v4.app.Fragment
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Toast
import com.georgeflug.budget.R
import com.georgeflug.budget.api.Transaction
import com.georgeflug.budget.api.TransactionApi
import kotlinx.android.synthetic.main.fragment_transactions.*
import java.math.BigDecimal
import java.text.SimpleDateFormat
import java.util.*

class TransactionsFragment : Fragment() {

    override fun onCreateView(inflater: LayoutInflater, container: ViewGroup?,
                              savedInstanceState: Bundle?): View? {
        return inflater.inflate(R.layout.fragment_transactions, container, false)
    }

    override fun onActivityCreated(savedInstanceState: Bundle?) {
        super.onActivityCreated(savedInstanceState)

        updateTransactions()

        transactionList.setOnItemClickListener { parent, view, position, id ->
            val transaction = parent.adapter.getItem(position) as Transaction
            if (transaction.row != -1) {
                val dialog = EditTransactionDialog(context, transaction)
                dialog.setOnDismissListener {
                    updateTransactions()
                }
                dialog.show()
            }
        }
    }

    private fun updateTransactions() {
        TransactionApi.getTransactions()
                .subscribe({
                    val transactions = it.rows.sortedByDescending(Transaction::getBestDate).toMutableList().addSections()
                    transactionList.adapter = TransactionAdapter(context, transactions)
                }, {
                    Toast.makeText(context, it.toString(), Toast.LENGTH_LONG).show()
                })
    }

    private fun List<Transaction>.addSections(): List<Transaction> {
        var lastDate = ""
        val result = ArrayList<Transaction>()
        for (i in 0 until this.size) {
            val newDate = this[i].getBestDate()
            if (newDate != lastDate) {
                lastDate = newDate
                result.add(Transaction("", BigDecimal(99.88), "", getFriendlyDate(newDate), "SECTION", "", "", "", "", -1))
            }
            result.add(this[i])
        }
        return result
    }

    private val dateFormat = SimpleDateFormat("yyyy-MM-dd", Locale.US)
    private val dayOfWeekFormat = SimpleDateFormat("EEEE", Locale.US)
    private val printedDateFormat = SimpleDateFormat("EEEE, MMMM d", Locale.US)

    private fun getFriendlyDate(date: String): String {
        // format: 2018-09-17T05:00:00.0000Z
        val dateOnly = date.substring(0, date.indexOf('T'))
        val actualDate = dateFormat.parse(dateOnly)

        val cal = Calendar.getInstance()
        cal.add(Calendar.DATE, -1)
        val yesterday = dateFormat.format(cal.time)
        cal.add(Calendar.DATE, -6)
        val aWeekAgo = cal.time

        return when (dateOnly) {
            dateFormat.format(Date()) -> "Today"
            yesterday -> "Yesterday"
            else -> if (aWeekAgo.before(actualDate)) dayOfWeekFormat.format(actualDate) else printedDateFormat.format(actualDate)
        }
    }
}

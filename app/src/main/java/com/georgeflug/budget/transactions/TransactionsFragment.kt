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
import com.georgeflug.budget.util.DateUtil
import kotlinx.android.synthetic.main.fragment_transactions.*
import java.math.BigDecimal
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
                result.add(Transaction("", BigDecimal(99.88), "", DateUtil.getFriendlyDate(newDate), "SECTION", "", "", "", "", -1))
            }
            result.add(this[i])
        }
        return result
    }

}

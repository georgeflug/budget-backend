package com.georgeflug.budget.view.transaction.list

import android.os.Bundle
import android.support.v4.app.Fragment
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Toast
import com.georgeflug.budget.R
import com.georgeflug.budget.api.BudgetApi
import com.georgeflug.budget.model.Transaction
import com.georgeflug.budget.model.TransactionSplit
import com.georgeflug.budget.util.BudgetUtil
import com.georgeflug.budget.util.DateUtil
import com.georgeflug.budget.view.transaction.edit.EditTransactionDialog
import io.reactivex.android.schedulers.AndroidSchedulers
import kotlinx.android.synthetic.main.fragment_transactions.*
import java.math.BigDecimal
import java.util.ArrayList

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
            if (transaction._id != "SECTION") {
                val dialog = EditTransactionDialog(context, transaction)
                dialog.setOnDismissListener { BudgetUtil.updateBudgets(activity) }
                dialog.show()
            }
        }
    }

    private fun updateTransactions() {
        BudgetApi.transactions.listTransactions()
                .observeOn(AndroidSchedulers.mainThread())
                .subscribe({
                    val transactions = it.sortedWith(TransactionComparator()).toMutableList().addSections()
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
                val split = TransactionSplit(amount = BigDecimal.ZERO, budget = "SECTION", description = "SECTION")
                val transaction = Transaction(
                        _id = "SECTION",
                        totalAmount = BigDecimal.ZERO,
                        date = DateUtil.getFriendlyDate(newDate),
                        splits = listOf(split),
                        account = "",
                        plaidId = "",
                        postedDate = "",
                        postedDescription = "")
                result.add(transaction)
            }
            result.add(this[i])
        }
        return result
    }

}

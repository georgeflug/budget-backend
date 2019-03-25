package com.georgeflug.budget.view.transaction.list

import android.os.Bundle
import android.support.v4.app.Fragment
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import com.georgeflug.budget.R
import com.georgeflug.budget.util.BudgetUtil
import com.georgeflug.budget.view.transaction.edit.EditTransactionDialog
import kotlinx.android.synthetic.main.fragment_transactions.*

class TransactionsFragment : Fragment() {

    override fun onCreateView(inflater: LayoutInflater, container: ViewGroup?,
                              savedInstanceState: Bundle?): View? {
        return inflater.inflate(R.layout.fragment_transactions, container, false)
    }

    override fun onActivityCreated(savedInstanceState: Bundle?) {
        super.onActivityCreated(savedInstanceState)

        transactionList.adapter = TransactionAdapter(context)

        transactionList.setOnItemClickListener { parent, view, position, id ->
            val sectionOrTransaction = parent.adapter.getItem(position) as TransactionsModel.SectionOrTransaction
            if (sectionOrTransaction.transaction != null) {
                val dialog = EditTransactionDialog(context, sectionOrTransaction.transaction!!)
                dialog.setOnDismissListener { BudgetUtil.updateBudgets(activity) }
                dialog.show()
            }
        }
    }

}

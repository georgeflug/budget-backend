package com.georgeflug.budget

import android.os.Bundle
import android.support.v4.app.Fragment
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.SimpleAdapter
import android.widget.Toast
import com.google.gson.Gson
import kotlinx.android.synthetic.main.fragment_transactions.*

class TransactionsFragment : Fragment() {

    override fun onCreateView(inflater: LayoutInflater, container: ViewGroup?,
                              savedInstanceState: Bundle?): View? {
        return inflater.inflate(R.layout.fragment_transactions, container, false)
    }

    override fun onActivityCreated(savedInstanceState: Bundle?) {
        super.onActivityCreated(savedInstanceState)

        TransactionApi.getTransactions()
                .subscribe({
                    val result = Gson().fromJson(it, TransactionApiResult::class.java)
                    val from = arrayOf("Budget", "Description", "Amount")
                    val to = intArrayOf(R.id.itemBudgetText, R.id.itemDescriptionText, R.id.itemAmountText)
                    transactionList.adapter = SimpleAdapter(context, result.rows, R.layout.transaction_item, from, to)
                }, {
                    Toast.makeText(context, it.toString(), Toast.LENGTH_LONG).show()
                })
    }
}

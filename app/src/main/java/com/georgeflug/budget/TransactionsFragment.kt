package com.georgeflug.budget

import android.os.Bundle
import android.support.v4.app.Fragment
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.SimpleAdapter
import android.widget.Toast
import com.georgeflug.budget.R.array.budgets
import com.google.gson.Gson
import io.reactivex.Observable
import io.reactivex.android.schedulers.AndroidSchedulers
import io.reactivex.schedulers.Schedulers
import kotlinx.android.synthetic.main.fragment_add_transaction.*
import kotlinx.android.synthetic.main.fragment_transactions.*
import java.net.URL

class TransactionsFragment : Fragment() {

    override fun onCreateView(inflater: LayoutInflater, container: ViewGroup?,
                              savedInstanceState: Bundle?): View? {
        return inflater.inflate(R.layout.fragment_transactions, container, false)
    }

    override fun onActivityCreated(savedInstanceState: Bundle?) {
        super.onActivityCreated(savedInstanceState)

        val request = URL("https://script.google.com/macros/s/AKfycbzJXrwFepauVmiodXfe81zETyqgAMcwdjR8fRjJ1NvrcpAgPPg/exec")
        Observable.fromCallable { request.openStream().bufferedReader().use { it.readText() } }
                .subscribeOn(Schedulers.io())
                .observeOn(AndroidSchedulers.mainThread())
                .subscribe({
                    val result = Gson().fromJson(it, TransactionApiResult::class.java)
                    val from = arrayOf("Budget", "Description", "Amount")
                    val to = intArrayOf(R.id.itemBudgetText, R.id.itemDescriptionText, R.id.itemAmountText)
                    transactionList.adapter = SimpleAdapter(context, result.rows, R.layout.transaction_item, from, to)

                    Toast.makeText(context, "Success!", Toast.LENGTH_LONG).show()
                }, {
                    Toast.makeText(context, it.toString(), Toast.LENGTH_LONG).show()
                })
    }
}

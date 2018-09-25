package com.georgeflug.budget

import android.os.Bundle
import android.support.v4.app.Fragment
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.SimpleAdapter
import android.widget.Toast
import com.georgeflug.budget.api.TransactionApi
import com.georgeflug.budget.budgets.Budget
import kotlinx.android.synthetic.main.fragment_add_transaction.*
import java.math.BigDecimal
import java.text.SimpleDateFormat
import java.util.*

class AddTransactionFragment : Fragment() {

    override fun onCreateView(inflater: LayoutInflater, container: ViewGroup?,
                              savedInstanceState: Bundle?): View? {
        return inflater.inflate(R.layout.fragment_add_transaction, container, false)
    }

    override fun onActivityCreated(savedInstanceState: Bundle?) {
        super.onActivityCreated(savedInstanceState)
        prepareBudgetSpinner()
        submitTransactionButton.setOnClickListener {
            val amount = BigDecimal(amountText.text.toString()).negate()
            val description = descriptionText.text.toString()
            val budget = (budgetText.selectedItem as HashMap<String, String>)["title"]
            val date = SimpleDateFormat("MM-dd-yyyy").format(Date())
            TransactionApi.addTransaction(date, amount.toString(), budget!!, description)
                    .subscribe({
                        Toast.makeText(context, "Success!", Toast.LENGTH_LONG).show()
                        amountText.setText("")
                        descriptionText.setText("")
                        amountText.requestFocus()
                    }, {
                        Toast.makeText(context, it.toString(), Toast.LENGTH_LONG).show()
                    })
        }
    }

    private fun prepareBudgetSpinner() {
        val items = Budget.values()
                .sortedBy { it.title }
                .map { mutableMapOf("title" to it.title, "description" to it.description) }
                .toMutableList()
        val from = arrayOf("title", "description")
        val to = intArrayOf(R.id.line1, R.id.line2)
        budgetText.adapter = SimpleAdapter(context, items, R.layout.spinner_two_lines, from, to)
    }
}

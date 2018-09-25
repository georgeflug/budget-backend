package com.georgeflug.budget.transactions

import android.app.Dialog
import android.content.Context
import android.os.Bundle
import android.view.Window
import android.view.WindowManager
import android.widget.SimpleAdapter
import android.widget.Toast
import com.georgeflug.budget.R
import com.georgeflug.budget.R.id.editBudgetText
import com.georgeflug.budget.api.Transaction
import com.georgeflug.budget.api.TransactionApi
import com.georgeflug.budget.budgets.Budget
import kotlinx.android.synthetic.main.fragment_edit_transaction.*
import java.math.BigDecimal
import java.text.SimpleDateFormat
import java.util.*


class EditTransactionDialog(context: Context, private val transaction: Transaction) : Dialog(context) {
    val budgetItems = Budget.values()
            .sortedBy { it.title }
            .map { mutableMapOf("title" to it.title, "description" to it.description) }
            .toMutableList()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        requestWindowFeature(Window.FEATURE_NO_TITLE)
        setContentView(R.layout.fragment_edit_transaction)
        window.setLayout(WindowManager.LayoutParams.MATCH_PARENT, WindowManager.LayoutParams.MATCH_PARENT)

        prepareBudgetSpinner()

        editAmountText.setText(transaction.amount.toString())
        editDescriptionText.setText(transaction.description)
        editPostedDescriptionText.text = transaction.postedDescription
        editBudgetText.setSelection(budgetItems.indexOfFirst { it["title"] == transaction.budget })
        editDateText.setText(formatDate(if (transaction.date.isNullOrBlank()) transaction.postedDate else transaction.date))

        updateTransactionButton.setOnClickListener {
            val amount = BigDecimal(editAmountText.text.toString())
            val description = editDescriptionText.text.toString()
            val budget = (editBudgetText.selectedItem as HashMap<String, String>)["title"]
            val date = editDateText.text.toString()
            val row = transaction.row
            TransactionApi.updateTransaction(date, amount.toString(), budget!!, description, row)
                    .subscribe({
                        Toast.makeText(context, "Success!", Toast.LENGTH_LONG).show()
                        dismiss()
                    }, {
                        Toast.makeText(context, it.toString(), Toast.LENGTH_LONG).show()
                    })
        }
    }

    private fun formatDate(date: String): String {
        val postedDateFormat = SimpleDateFormat("yyyy-MM-dd", Locale.US)
        val desiredDateFormat = SimpleDateFormat("MM-dd-yyyy")

        val dateOnly = date.substring(0, date.indexOf('T'))
        val actualDate = postedDateFormat.parse(dateOnly)

        return desiredDateFormat.format(actualDate)
    }

    private fun prepareBudgetSpinner() {
        val from = arrayOf("title", "description")
        val to = intArrayOf(R.id.line1, R.id.line2)
        editBudgetText.adapter = SimpleAdapter(context, budgetItems, R.layout.spinner_two_lines, from, to)
    }
}
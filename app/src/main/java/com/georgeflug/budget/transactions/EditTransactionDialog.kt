package com.georgeflug.budget.transactions

import android.app.Dialog
import android.content.Context
import android.os.Bundle
import android.util.Log
import android.view.Window
import android.view.WindowManager
import android.widget.SimpleAdapter
import android.widget.Toast
import com.georgeflug.budget.R
import com.georgeflug.budget.api.Transaction
import com.georgeflug.budget.api.TransactionApi
import com.georgeflug.budget.budgets.Budget
import com.georgeflug.budget.util.AlertUtil
import com.georgeflug.budget.util.DateUtil
import kotlinx.android.synthetic.main.fragment_edit_transaction.*
import java.math.BigDecimal
import java.util.*


class EditTransactionDialog(context: Context, private val transaction: SplittableTransaction) : Dialog(context) {
    val budgetItems = Budget.values()
            .sortedBy { it.title }
            .map { mutableMapOf("title" to it.title, "description" to it.description, "iconId" to it.iconId.toString()) }
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
        val dateToUse = if (transaction.date.isNullOrBlank()) transaction.postedDate else transaction.date
        editDateText.setText(DateUtil.cleanupDate(dateToUse))

        updateTransactionButton.setOnClickListener {
            val progressDialog = AlertUtil.showProgress(context, "Edit Transaction", "Saving...")

            val amount = BigDecimal(editAmountText.text.toString())
            val description = editDescriptionText.text.toString()
            val budget = (editBudgetText.selectedItem as HashMap<String, String>)["title"]
            val date = editDateText.text.toString()
            val row = transaction.row
            TransactionApi.updateTransaction(date, amount.toString(), budget!!, description, row)
                    .doOnNext { progressDialog.dismiss() }
                    .subscribe({
                        // write updates back into transaction object
                        transaction.amount = amount
                        transaction.description = description
                        transaction.budget = budget
                        Log.d("foo", "date changing from ${transaction.date} to $date")
                        transaction.date = date
                        Toast.makeText(context, "Success!", Toast.LENGTH_LONG).show()
                        dismiss()
                    }, {
                        Toast.makeText(context, it.toString(), Toast.LENGTH_LONG).show()
                    })
        }
    }

    private fun prepareBudgetSpinner() {
        val from = arrayOf("title", "description", "iconId")
        val to = intArrayOf(R.id.line1, R.id.line2, R.id.image)
        editBudgetText.adapter = SimpleAdapter(context, budgetItems, R.layout.budget_spinner_item, from, to)
    }
}
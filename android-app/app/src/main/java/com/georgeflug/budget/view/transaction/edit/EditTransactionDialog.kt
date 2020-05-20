package com.georgeflug.budget.view.transaction.edit

import android.app.Dialog
import android.content.Context
import android.os.Bundle
import android.view.Window
import android.view.WindowManager
import android.widget.SimpleAdapter
import android.widget.Toast
import com.georgeflug.budget.R
import com.georgeflug.budget.api.BudgetApi
import com.georgeflug.budget.model.Budget
import com.georgeflug.budget.model.Transaction
import com.georgeflug.budget.model.TransactionSplit
import com.georgeflug.budget.model.TransactionUpdateRequest
import com.georgeflug.budget.util.AlertUtil
import com.georgeflug.budget.util.DateUtil
import io.reactivex.android.schedulers.AndroidSchedulers
import kotlinx.android.synthetic.main.fragment_edit_transaction_dialog.*
import java.math.BigDecimal

class EditTransactionDialog(context: Context, private val transaction: Transaction) : Dialog(context) {
    val budgetItems = Budget.values()
            .sortedBy { it.title }
            .map { mutableMapOf("title" to it.title, "description" to it.description, "iconId" to it.iconId.toString()) }
            .toMutableList()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        requestWindowFeature(Window.FEATURE_NO_TITLE)
        setContentView(R.layout.fragment_edit_transaction)
        window!!.setLayout(WindowManager.LayoutParams.MATCH_PARENT, WindowManager.LayoutParams.MATCH_PARENT)

        prepareBudgetSpinner()

        amountText.setText(transaction.totalAmount.toString())
        descriptionText.setText(transaction.splits[0].description)
        postedDescriptionText.text = transaction.postedDescription
        budgetText.setSelection(budgetItems.indexOfFirst { it["title"] == transaction.splits[0].budget })
        dateText.setText(DateUtil.dateToString(transaction.bestDate))

        updateTransactionButton.setOnClickListener {
            val progressDialog = AlertUtil.showProgress(context, "Edit Transaction", "Saving...")

            val amount = BigDecimal(amountText.text.toString())
            val description = descriptionText.text.toString()
            val budget = (budgetText.selectedItem as HashMap<String, String>)["title"]!!

            val splits = listOf(
                    TransactionSplit(amount = amount, budget = budget, description = description)
            )
            val updateRequest = TransactionUpdateRequest(transaction.version, splits)
            BudgetApi.transactions.updateTransaction(transaction.id, updateRequest)
                    .observeOn(AndroidSchedulers.mainThread())
                    .doOnNext { progressDialog.dismiss() }
                    .subscribe({
                        // write updates back into transaction object
//                        transaction.amount = amount
//                        transaction.description = description
//                        transaction.budget = budget
//                        Timber.d("foo", "date changing from ${transaction.date} to $date")
//                        transaction.ate = date
                        // TODO: emit the new transaction
                        Toast.makeText(context, "Success!", Toast.LENGTH_LONG).show()
                        dismiss()
                    }, {
                        AlertUtil.showError(context, it, "Could not update transaction")
                    })
        }
    }

    private fun prepareBudgetSpinner() {
        val from = arrayOf("title", "description", "iconId")
        val to = intArrayOf(R.id.line1, R.id.line2, R.id.image)
        budgetText.adapter = SimpleAdapter(context, budgetItems, R.layout.budget_spinner_item, from, to)
    }
}
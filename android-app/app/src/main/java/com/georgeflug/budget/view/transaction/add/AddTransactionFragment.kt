package com.georgeflug.budget.view.transaction.add

import android.app.Activity
import android.app.Fragment
import android.content.Context
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.view.ViewTreeObserver
import android.view.inputmethod.InputMethodManager
import android.widget.Toast
import com.georgeflug.budget.R
import com.georgeflug.budget.model.Budget
import com.georgeflug.budget.service.TransactionService
import com.georgeflug.budget.util.AlertUtil
import io.reactivex.android.schedulers.AndroidSchedulers
import kotlinx.android.synthetic.main.fragment_add_transaction.*
import java.math.BigDecimal

class AddTransactionFragment : Fragment() {
    private val GOOGLE_PIXEL_HEIGHT_WITHOUT_KEYBOARD = 1704

    var amountEntered = ""

    val keyboardLayoutListener = ViewTreeObserver.OnGlobalLayoutListener {
        val activityRootView = activity.window.decorView.findViewById<View>(android.R.id.content)
        val visibility = if (activityRootView.height < GOOGLE_PIXEL_HEIGHT_WITHOUT_KEYBOARD) View.GONE else View.VISIBLE
        amountButton1.visibility = visibility
        amountButton2.visibility = visibility
        amountButton3.visibility = visibility
        amountButton4.visibility = visibility
        amountButton5.visibility = visibility
        amountButton6.visibility = visibility
        amountButton7.visibility = visibility
        amountButton8.visibility = visibility
        amountButton9.visibility = visibility
        amountButton0.visibility = visibility
        amountButtonBack.visibility = visibility
        amountButtonPlaceholder.visibility = visibility
        addTransactionBudgetSelector.unselectedVisible = visibility
        addTransactionScrollView.post { addTransactionScrollView?.smoothScrollTo(0, 0) }
    }

    override fun onCreateView(inflater: LayoutInflater, container: ViewGroup?,
                              savedInstanceState: Bundle?): View? {
        return inflater.inflate(R.layout.fragment_add_transaction, container, false)
    }

    override fun onResume() {
        super.onResume()

        submitTransactionButton.setOnClickListener { view ->

            if (amountEntered.isEmpty()) {
                AlertUtil.showAlert(context, "Invalid", "Enter an amount")
            } else {
                val progressDialog = AlertUtil.showProgress(context, "Add Transaction", "Saving...")

                val amount = BigDecimal(amountText.text.toString().trim())
                val description = descriptionText.text.toString()
                val budget = addTransactionBudgetSelector.selectedBudget?.title
                        ?: Budget.UNKNOWN.title

                TransactionService.addTransaction(amount, budget, description)
                        .observeOn(AndroidSchedulers.mainThread())
                        .doAfterSuccess { progressDialog.dismiss(); }
                        .subscribe({
                            Toast.makeText(context, "Success!", Toast.LENGTH_LONG).show()
                            amountEntered = ""
                            updateAmountText()
                            descriptionText.setText("")
                            addTransactionBudgetSelector.selectedBudget = null
                            addTransactionBudgetSelector.selectedRadio = null
                            amountText.requestFocus()
                            val imm = context.getSystemService(Activity.INPUT_METHOD_SERVICE) as InputMethodManager
                            imm.hideSoftInputFromWindow(view?.windowToken, 0)
                        }, {
                            AlertUtil.showError(context, it, "Could not add transaction")
                        })
            }
        }

        amountButton0.setOnClickListener { clickButton("0") }
        amountButton1.setOnClickListener { clickButton("1") }
        amountButton2.setOnClickListener { clickButton("2") }
        amountButton3.setOnClickListener { clickButton("3") }
        amountButton4.setOnClickListener { clickButton("4") }
        amountButton5.setOnClickListener { clickButton("5") }
        amountButton6.setOnClickListener { clickButton("6") }
        amountButton7.setOnClickListener { clickButton("7") }
        amountButton8.setOnClickListener { clickButton("8") }
        amountButton9.setOnClickListener { clickButton("9") }
        amountButtonBack.setOnClickListener {
            if (amountEntered.isNotEmpty()) {
                amountEntered = amountEntered.dropLast(1)
                updateAmountText()
            }
        }

        addTransactionBudgetSelector.setOnClickListener {
            descriptionText.requestFocus()
            val imm = context.getSystemService(Context.INPUT_METHOD_SERVICE) as InputMethodManager
            imm.showSoftInput(descriptionText, InputMethodManager.SHOW_IMPLICIT)
        }

        val activityRootView = activity.window.decorView.findViewById<View>(android.R.id.content)
        activityRootView.viewTreeObserver.addOnGlobalLayoutListener(keyboardLayoutListener)
    }

    override fun onPause() {
        super.onPause()

        val activityRootView = activity.window.decorView.findViewById<View>(android.R.id.content)
        activityRootView.viewTreeObserver.removeOnGlobalLayoutListener(keyboardLayoutListener)
    }

    private fun clickButton(buttonText: String) {
        amountEntered += buttonText
        updateAmountText()
    }

    private fun updateAmountText() {
        if (amountEntered.length > 1) {
            amountText.text = amountEntered.dropLast(2).padStart(4, ' ') + "." + amountEntered.takeLast(2).padStart(2, ' ')
        } else if (amountEntered.length == 1) {
            amountText.text = "    . $amountEntered"
        } else {
            amountText.text = "    .  "
        }
    }
}

package com.georgeflug.budget.view.transaction.edit

import android.app.Fragment
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import com.georgeflug.budget.R
import com.georgeflug.budget.model.Transaction
import com.georgeflug.budget.util.FragmentUtil
import kotlinx.android.synthetic.main.fragment_enter_amount.*
import java.math.BigDecimal

class EnterAmountFragment : Fragment() {
    var amount = BigDecimal.ZERO
    var amountEntered = ""
    private val selectBudgetFragment = SelectBudgetFragment()
    val isSuccess
        get() = selectBudgetFragment.isSuccess
    val description
        get() = selectBudgetFragment.description
    val budget
        get() = selectBudgetFragment.selectedBudget!!

    override fun onCreateView(inflater: LayoutInflater, container: ViewGroup?,
                              savedInstanceState: Bundle?): View? {
        return inflater.inflate(R.layout.fragment_enter_amount, container, false)
    }

    override fun onResume() {
        super.onResume()

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
        nextButton.setOnClickListener {
            FragmentUtil.showAndAddToBackStack(selectBudgetFragment)
        }

        updateAmountText()
    }

    private fun clickButton(buttonText: String) {
        amountEntered += buttonText
        updateAmountText()
    }

    private fun updateAmountText() {
        if (amountEntered.length > 1) {
            amountText.text = amountEntered.dropLast(2).padStart(4, ' ') + "." + amountEntered.takeLast(2).padStart(2, ' ')
            amount = BigDecimal(amountText.text.toString().trim())
        } else if (amountEntered.length == 1) {
            amountText.text = "    . $amountEntered"
            amount = BigDecimal("0.0$amountEntered")
        } else {
            amountText.text = "    .  "
            amount = BigDecimal.ZERO
        }
        nextButton.isEnabled = (amount != BigDecimal.ZERO)
    }

    companion object {
        val TRANSACTION_BUNDLE_KEY = "Transaction"

        fun getFragment(transaction: Transaction): Fragment {
            val fragment = EditTransactionFragment()
            val bundle = Bundle()
            bundle.putParcelable(TRANSACTION_BUNDLE_KEY, transaction)
            fragment.arguments = bundle
            return fragment
        }
    }
}
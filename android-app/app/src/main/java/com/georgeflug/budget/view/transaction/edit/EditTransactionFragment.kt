package com.georgeflug.budget.view.transaction.edit

import android.app.Fragment
import android.os.Bundle
import android.support.annotation.IdRes
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Button
import android.widget.ImageView
import android.widget.TextView
import com.georgeflug.budget.R
import com.georgeflug.budget.model.Budget
import com.georgeflug.budget.model.Transaction
import com.georgeflug.budget.model.TransactionSplit
import com.georgeflug.budget.util.DateUtil
import com.georgeflug.budget.util.FragmentUtil
import com.georgeflug.budget.util.MoneyUtil
import kotlinx.android.synthetic.main.fragment_edit_transaction.*
import java.math.BigDecimal

class EditTransactionFragment : Fragment() {
    lateinit var transaction: Transaction
    lateinit var splits: MutableList<TransactionSplit>
    var splitFragment: EnterAmountFragment? = null
    var splitToFurtherSplit: Int? = null
    var editFragment: SelectBudgetFragment? = null
    var splitToEdit: Int? = null

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        val bundle = this.arguments
        if (bundle != null) {
            transaction = bundle.getParcelable(TRANSACTION_BUNDLE_KEY)
            splits = transaction.splits
                    .sortedBy { it.amount }
                    .asReversed()
                    .toMutableList()
        }
    }

    override fun onCreateView(inflater: LayoutInflater, container: ViewGroup?,
                              savedInstanceState: Bundle?): View? {
        return inflater.inflate(R.layout.fragment_edit_transaction, container, false)
    }

    override fun onStart() {
        super.onStart()

        totalAmount.setText(MoneyUtil.format(transaction.totalAmount))
        postedDescription.setText(textOrUnknown(transaction.postedDescription))
        date.setText(DateUtil.getFriendlyDate(transaction.bestDate))
        account.setText(textOrUnknown(transaction.account))
    }

    override fun onResume() {
        super.onResume()

        processResultOfSplitWorkflow()
        processResultOfEditWorkflow()

        updateView()
    }

    private fun processResultOfSplitWorkflow() {
        val fragment = splitFragment
        val splitIndex = splitToFurtherSplit
        splitFragment = null
        splitToFurtherSplit = null
        if (fragment != null && splitIndex != null && fragment.isSuccess) {
            val originalSplit = splits[splitIndex]
            val newSplit = TransactionSplit(fragment.amount, fragment.budget.title, fragment.description)
            val modifiedSplit = TransactionSplit(originalSplit.amount - fragment.amount, originalSplit.budget, originalSplit.description)
            splits[splitIndex] = modifiedSplit
            splits.add(splitIndex + 1, newSplit)
        }
    }

    private fun processResultOfEditWorkflow() {
        val fragment = editFragment
        val splitIndex = splitToEdit
        editFragment = null
        splitToEdit = null
        if (fragment != null && splitIndex != null && fragment.isSuccess) {
            val originalSplit = splits[splitIndex]
            val modifiedSplit = TransactionSplit(originalSplit.amount, fragment.budget!!.title, fragment.description)
            splits[splitIndex] = modifiedSplit
        }
    }

    private fun updateView() {
        splitListHolder.removeAllViews()
        splits
                .forEachIndexed { index, split ->
                    val splitView = layoutInflater.inflate(R.layout.edit_transaction_split_item, splitListHolder, false)
                    splitView.findViewById<ImageView>(R.id.budgetIcon).setImageResource(split.realBudget.iconId)
                    splitView.findViewById<TextView>(R.id.budgetText).setText(split.realBudget.title)
                    splitView.findViewById<TextView>(R.id.amount).setText(MoneyUtil.format(split.amount))
                    splitView.findViewById<TextView>(R.id.description).setText(split.description)
                    if (split.amount == BigDecimal(0.01)) hideButton(splitView, R.id.splitButton)
                    if (splits.size == 1) hideButton(splitView, R.id.deleteButton)

                    splitView.findViewById<Button>(R.id.splitButton).setOnClickListener {
                        splitFragment = EnterAmountFragment()
                        splitToFurtherSplit = index
                        FragmentUtil.showAndAddToBackStack(splitFragment!!, FragmentUtil.EditDetailsWorkflowStack)
                    }
                    splitView.findViewById<Button>(R.id.deleteButton).setOnClickListener {
                        splits.remove(split)
                        val unknownSplit = splits.find { it.realBudget == Budget.UNKNOWN && it.description.isEmpty() }
                                ?: TransactionSplit(BigDecimal.ZERO, Budget.UNKNOWN.title, "")
                        val newUnknownSplit = TransactionSplit(split.amount + unknownSplit.amount, unknownSplit.budget, unknownSplit.description)
                        splits.remove(unknownSplit)
                        splits.add(newUnknownSplit)
                        updateView()
                    }
                    splitView.findViewById<Button>(R.id.editButton).setOnClickListener {
                        val fragment = SelectBudgetFragment()
                        fragment.budget = split.realBudget
                        fragment.description = split.description
                        splitToEdit = index
                        editFragment = fragment
                        FragmentUtil.showAndAddToBackStack(editFragment!!, FragmentUtil.EditDetailsWorkflowStack)
                    }

                    splitListHolder.addView(splitView)
                }
    }

    private fun hideButton(view: View, @IdRes id: Int) {
        view.findViewById<View>(id).visibility = View.GONE
    }

    private fun textOrUnknown(text: String?): String {
        return if (text.isNullOrEmpty()) "Unknown" else text
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
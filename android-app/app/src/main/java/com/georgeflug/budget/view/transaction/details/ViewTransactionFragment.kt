package com.georgeflug.budget.view.transaction.details

import android.app.Fragment
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ImageView
import android.widget.TextView
import com.georgeflug.budget.R
import com.georgeflug.budget.model.Transaction
import com.georgeflug.budget.model.TransactionSplit
import com.georgeflug.budget.service.TransactionService
import com.georgeflug.budget.util.AlertUtil
import com.georgeflug.budget.util.DateUtil
import com.georgeflug.budget.util.FragmentUtil
import com.georgeflug.budget.util.MoneyUtil
import com.georgeflug.budget.view.transaction.edit.EditTransactionFragment
import io.reactivex.android.schedulers.AndroidSchedulers
import io.reactivex.disposables.Disposable
import kotlinx.android.synthetic.main.fragment_view_transaction.*

class ViewTransactionFragment : Fragment() {
    lateinit var transaction: Transaction
    var listener: Disposable? = null

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        val bundle = this.arguments
        if (bundle != null) {
            transaction = bundle.getParcelable(TRANSACTION_BUNDLE_KEY)!!
        }
    }

    override fun onCreateView(inflater: LayoutInflater, container: ViewGroup?,
                              savedInstanceState: Bundle?): View? {
        return inflater.inflate(R.layout.fragment_view_transaction, container, false)
    }

    override fun onStop() {
        super.onStop()
        listener?.dispose()
    }

    override fun onStart() {
        super.onStart()

        listener = TransactionService.listenForNewTransactions()
                .filter { it._id == transaction._id }
                .observeOn(AndroidSchedulers.mainThread())
                .subscribe({
                    transaction = it
                    populateDetails()
                }, {
                    AlertUtil.showError(context, it, "Could not retrieve transactions")
                })

        populateDetails()

        editButton.setOnClickListener {
            val fragment = EditTransactionFragment.getFragment(transaction)
            FragmentUtil.showAndAddToBackStack(fragment)
        }
    }

    private fun populateDetails() {
        totalAmount.setText(MoneyUtil.format(transaction.totalAmount))
        postedDescription.setText(textOrUnknown(transaction.postedDescription))
        date.setText(DateUtil.getFriendlyDate(transaction.bestDate))
        account.setText(textOrUnknown(transaction.account))

        splitListHolder.removeAllViews()
        if (transaction.splits.size == 1) {
            highLevelDescription.setText(getHighLevelDescription())
        } else {
            transaction.splits
                    .forEach {
                        val splitView = layoutInflater.inflate(R.layout.view_transaction_split_item, splitListHolder, false)
                        splitView.findViewById<TextView>(R.id.splitItemText).setText(getDescription(it))
                        splitView.findViewById<TextView>(R.id.splitItemAmount).setText(MoneyUtil.format(it.amount))
                        splitListHolder.addView(splitView)
                    }
        }

        budgetIconHolder.removeAllViews()
        transaction.splits
                .sortedBy { it.amount }
                .asReversed()
                .map { it.realBudget }
                .distinct()
                .forEach {
                    val iconView = layoutInflater.inflate(R.layout.view_transaction_budget_icon, budgetIconHolder, false)
                    iconView.findViewById<ImageView>(R.id.budgetIcon).setImageResource(it.iconId)
                    budgetIconHolder.addView(iconView)
                }
    }

    private fun getDescription(split: TransactionSplit): String {
        if (split.description.isEmpty()) {
            return split.realBudget.name
        }
        return "${split.realBudget.name} - ${split.description}"
    }

    private fun getHighLevelDescription(): String {
        val split = transaction.splits[0]
        if (split.description.isEmpty()) {
            return split.realBudget.name
        }
        return "${split.budget} - ${split.description}"
    }

    private fun textOrUnknown(text: String?): String {
        return if (text.isNullOrEmpty()) "Unknown" else text
    }

    companion object {
        val TRANSACTION_BUNDLE_KEY = "Transaction"

        fun getFragment(transaction: Transaction): Fragment {
            val fragment = ViewTransactionFragment()
            val bundle = Bundle()
            bundle.putParcelable(TRANSACTION_BUNDLE_KEY, transaction)
            fragment.arguments = bundle
            return fragment
        }
    }
}
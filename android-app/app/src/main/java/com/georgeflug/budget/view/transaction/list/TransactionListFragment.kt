package com.georgeflug.budget.view.transaction.list

import android.annotation.SuppressLint
import android.app.Fragment
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Toast
import com.georgeflug.budget.R
import com.georgeflug.budget.model.Budget
import com.georgeflug.budget.model.Transaction
import com.georgeflug.budget.model.TransactionSplit
import com.georgeflug.budget.service.TransactionService
import com.georgeflug.budget.util.AlertUtil
import com.georgeflug.budget.util.FragmentUtil
import com.georgeflug.budget.view.transaction.details.ViewTransactionFragment
import com.georgeflug.budget.view.transaction.edit.SelectBudgetFragment
import io.reactivex.android.schedulers.AndroidSchedulers
import io.reactivex.disposables.Disposable
import kotlinx.android.synthetic.main.fragment_transactions.*

class TransactionListFragment : Fragment() {
    var editFragment: SelectBudgetFragment? = null
    var transactionToEdit: Transaction? = null
    val model = TransactionsDynamicallyFilterableModel()
    var disposable: Disposable? = null

    var filterMonth: Int? = null
        set(value) {
            model.filterMonth = value
            field = value
        }
    var filterBudget: Budget? = null
        set(value) {
            model.filterBudget = value
            field = value
        }

    override fun onCreateView(inflater: LayoutInflater, container: ViewGroup?,
                              savedInstanceState: Bundle?): View? {
        return inflater.inflate(R.layout.fragment_transactions, container, false)
    }

    override fun onActivityCreated(savedInstanceState: Bundle?) {
        super.onActivityCreated(savedInstanceState)
        transactionList.adapter = TransactionAdapter(context, model)
        pullToRefresh.setOnRefreshListener(this::refreshNow)
    }

    private fun refreshNow() {
        pullToRefresh.isRefreshing = true
        disposable = TransactionService.refresh()
                .observeOn(AndroidSchedulers.mainThread())
                .subscribe({
                    pullToRefresh.isRefreshing = false
                }, {
                    pullToRefresh.isRefreshing = false
                    AlertUtil.showError(context, it, "Failed to refresh transactions")
                })
    }

    override fun onStop() {
        super.onStop()
        disposable?.dispose()
    }

    override fun onResume() {
        super.onResume()
        processQuickEditResult()

        transactionList.setOnItemClickListener { parent, _, position, _ ->
            val sectionOrTransaction = parent.adapter.getItem(position) as SectionOrTransaction

            sectionOrTransaction.transaction?.let { transaction ->
                if (transaction.splits.size == 1) {
                    showQuickEditFragment(transaction)
                } else {
                    showViewTransactionFragment(transaction)
                }
            }
        }

    }

    private fun showViewTransactionFragment(transaction: Transaction) {
        val fragment = ViewTransactionFragment.getFragment(transaction)
        FragmentUtil.showAndAddToBackStack(fragment)
    }

    private fun showQuickEditFragment(transaction: Transaction) {
        val fragment = SelectBudgetFragment()
        fragment.description = transaction.splits[0].description
        fragment.budget = transaction.splits[0].realBudget
        fragment.showAdvancedButton = true
        FragmentUtil.showAndAddToBackStack(fragment, FragmentUtil.EditDetailsWorkflowStack)
        editFragment = fragment
        transactionToEdit = transaction
    }

    private fun processQuickEditResult() {
        val fragment = editFragment
        val transaction = transactionToEdit
        editFragment = null
        transactionToEdit = null

        if (fragment != null && transaction != null) {
            if (fragment.isSuccess) {
                saveUpdatedQuickEditTransaction(transaction, fragment)
            } else if (fragment.isAdvancedButtonExit) {
                showViewTransactionFragment(transaction)
            }
        }
    }

    @SuppressLint("CheckResult")
    private fun saveUpdatedQuickEditTransaction(transaction: Transaction, fragment: SelectBudgetFragment) {
        val oldSplit = transaction.splits[0]
        val progressDialog = AlertUtil.showProgress(context, "Update Transaction", "Saving...")
        val updatedTransaction = Transaction(
                _id = transaction._id,
                plaidId = transaction.plaidId,
                date = transaction.date,
                totalAmount = transaction.totalAmount,
                account = transaction.account,
                postedDate = transaction.postedDate,
                postedDescription = transaction.postedDescription,
                splits = listOf(TransactionSplit(oldSplit.amount, fragment.budget!!.title, fragment.description)),
                lastModified = transaction.lastModified
        )
        TransactionService.updateTransaction(updatedTransaction)
                .observeOn(AndroidSchedulers.mainThread())
                .doOnNext { progressDialog.dismiss(); }
                .subscribe({
                    Toast.makeText(context, "Success!", Toast.LENGTH_LONG).show()
                }, {
                    AlertUtil.showError(context, it, "Could not update transaction")
                })

    }
}

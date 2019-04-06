package com.georgeflug.budget.view.transaction.list

import android.app.Fragment
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import com.georgeflug.budget.R
import com.georgeflug.budget.view.main.MainActivity
import com.georgeflug.budget.view.transaction.details.ViewTransactionFragment
import kotlinx.android.synthetic.main.fragment_transactions.*

class TransactionListFragment : Fragment() {

    override fun onCreateView(inflater: LayoutInflater, container: ViewGroup?,
                              savedInstanceState: Bundle?): View? {
        return inflater.inflate(R.layout.fragment_transactions, container, false)
    }

    override fun onActivityCreated(savedInstanceState: Bundle?) {
        super.onActivityCreated(savedInstanceState)

        transactionList.adapter = TransactionAdapter(context)

        transactionList.setOnItemClickListener { parent, _, position, _ ->
            val sectionOrTransaction = parent.adapter.getItem(position) as TransactionsModel.SectionOrTransaction
            if (sectionOrTransaction.transaction != null) {

                val fragment = ViewTransactionFragment.getFragment(sectionOrTransaction.transaction)
                displayChildFragment(fragment)
                MainActivity.addToBackStack(fragment)

            }
        }
    }

    private fun displayChildFragment(fragment: Fragment) {
        fragmentManager
                .beginTransaction()
                .replace(R.id.fragmentContainer, fragment)
                .addToBackStack(null)
                .commit()
    }
}

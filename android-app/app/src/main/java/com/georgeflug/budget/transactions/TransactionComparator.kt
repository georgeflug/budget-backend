package com.georgeflug.budget.transactions

import com.georgeflug.budget.api.model.Transaction

class TransactionComparator : Comparator<Transaction> {
    override fun compare(o1: Transaction, o2: Transaction): Int {
        val dateCompare = o2.getBestDate().compareTo(o1.getBestDate())
        return if (dateCompare != 0) {
            dateCompare
        } else {
            // causes first-entered transactions to appear first.
            // also causes split-transactions to appear next to each other.
            o1._id.compareTo(o2._id)
        }
    }
}
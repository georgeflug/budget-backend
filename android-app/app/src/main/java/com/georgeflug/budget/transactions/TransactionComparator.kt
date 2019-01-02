package com.georgeflug.budget.transactions

import com.georgeflug.budget.api.Transaction

class TransactionComparator : Comparator<Transaction> {
    override fun compare(o1: Transaction, o2: Transaction): Int {
        val dateCompare = o2.getBestDate().compareTo(o1.getBestDate())
        return if (dateCompare != 0) {
            dateCompare
        } else {
            // causes first-entered transactions to appear first.
            // also causes split-transactions to appear next to each other.
            o1.id.compareTo(o2.id)
        }
    }
}
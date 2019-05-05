package com.georgeflug.budget.view.transaction.list

import com.georgeflug.budget.model.Transaction

interface TransactionsModel {
    val items: ArrayList<SectionOrTransaction>

    val size: Int

    fun getSectionOrTransactionAt(position: Int): SectionOrTransaction

    fun setOnChangeListener(onChange: () -> Unit)
}

data class SectionOrTransaction(
        val section: Section?,
        val transaction: Transaction?)

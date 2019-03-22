package com.georgeflug.budget.api.model

import java.math.BigDecimal

data class Transaction(
        val _id: String,
        val plaidId: String,
        val date: String,
        val totalAmount: BigDecimal,
        val account: String,
        val postedDate: String,
        val postedDescription: String,
        val splits: List<TransactionSplit>
) {
    fun getBestDate(): String = if (date.isBlank()) postedDate else date
    fun isPartial(): Boolean = _id.contains(".")
}

package com.georgeflug.budget.transactions

import com.georgeflug.budget.api.Transaction
import java.math.BigDecimal

data class SplittableTransaction(
        val id: String,
        var date: String,
        var amount: BigDecimal,
        var budget: String,
        var description: String,
        val account: String,
        val postedDate: String,
        val postedDescription: String,
        val transactionType: String,
        val status: String,
        val row: Int,
        val splits: List<Transaction>
) {
    fun getBestDate(): String = if (date.isBlank()) postedDate else date
    fun isPartial(): Boolean = id.contains(".")
}

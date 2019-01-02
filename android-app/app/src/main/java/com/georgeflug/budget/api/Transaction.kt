package com.georgeflug.budget.api

import java.math.BigDecimal

data class Transaction(
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
        val row: Int
) {
    fun getBestDate(): String = if (date.isBlank()) postedDate else date
    fun isPartial(): Boolean = id.contains(".")
}

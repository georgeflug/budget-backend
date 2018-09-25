package com.georgeflug.budget.api

import java.math.BigDecimal

data class Transaction(
        val date: String,
        val amount: BigDecimal,
        val budget: String,
        val description: String,
        val account: String,
        val postedDate: String,
        val postedDescription: String,
        val transactionType: String,
        val status: String,
        val row: Int
) {
    fun getBestDate(): String = if (date.isBlank()) postedDate else date
}

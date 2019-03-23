package com.georgeflug.budget.model

import java.math.BigDecimal

data class TransactionSplit(
        val amount: BigDecimal,
        val budget: String,
        val description: String
)

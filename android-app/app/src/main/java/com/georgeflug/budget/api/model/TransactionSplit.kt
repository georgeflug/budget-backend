package com.georgeflug.budget.api.model

import java.math.BigDecimal

data class TransactionSplit(
        val amount: BigDecimal,
        val budget: String,
        val description: String
)

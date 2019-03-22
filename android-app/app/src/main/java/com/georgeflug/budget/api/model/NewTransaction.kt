package com.georgeflug.budget.api.model

import java.math.BigDecimal

data class NewTransaction(
        val date: String,
        val totalAmount: BigDecimal,
        val splits: List<TransactionSplit>
)

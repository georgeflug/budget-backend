package com.georgeflug.budget.model

import com.georgeflug.budget.util.DateUtil
import java.math.BigDecimal

data class Transaction(
        val _id: String,
        val plaidId: String?,
        val date: String,
        val totalAmount: BigDecimal,
        val account: String,
        val postedDate: String?,
        val postedDescription: String?,
        val splits: List<TransactionSplit>
) {
    val bestDate = DateUtil.parseDate(if (date.isBlank()) postedDate!! else date)
}

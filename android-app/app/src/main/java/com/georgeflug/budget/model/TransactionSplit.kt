package com.georgeflug.budget.model

import android.os.Parcelable
import kotlinx.android.parcel.Parcelize
import java.math.BigDecimal

@Parcelize
data class TransactionSplit(
        val amount: BigDecimal,
        val budget: String,
        val description: String
) : Parcelable {
    val realBudget = Budget.lookupOrUnknown(budget)
}

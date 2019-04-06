package com.georgeflug.budget.model

import android.os.Parcelable
import com.georgeflug.budget.util.DateUtil
import kotlinx.android.parcel.IgnoredOnParcel
import kotlinx.android.parcel.Parcelize
import java.math.BigDecimal

@Parcelize
data class Transaction(
        val _id: String,
        val plaidId: String?,
        val date: String,
        val totalAmount: BigDecimal,
        val account: String,
        val postedDate: String?,
        val postedDescription: String?,
        val splits: List<TransactionSplit>
) : Parcelable {

    @IgnoredOnParcel
    val bestDate = DateUtil.parseDate(if (date.isBlank()) postedDate!! else date)
}

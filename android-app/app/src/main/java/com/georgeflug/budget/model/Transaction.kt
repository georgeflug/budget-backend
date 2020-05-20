package com.georgeflug.budget.model

import android.os.Parcelable
import com.fasterxml.jackson.annotation.JsonIgnore
import com.georgeflug.budget.util.DateUtil
import kotlinx.android.parcel.IgnoredOnParcel
import kotlinx.android.parcel.Parcelize
import java.math.BigDecimal

@Parcelize
data class Transaction(
        val id: Int,
        val createdAt: String,
        val totalAmount: BigDecimal,
        val account: String?,
        val postedDate: String,
        val postedDescription: String,
        val splits: List<TransactionSplit>,
        val updatedAt: String = "2018-09-01T12:00:00.000Z"
) : Parcelable {

    @IgnoredOnParcel
    @JsonIgnore
    val bestDate = DateUtil.parseDate(if (createdAt.isBlank()) postedDate else createdAt)
}

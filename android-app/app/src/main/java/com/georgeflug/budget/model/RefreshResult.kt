package com.georgeflug.budget.model

import android.os.Parcelable
import kotlinx.android.parcel.Parcelize

@Parcelize
data class RefreshResult(
        val newRecords: Int,
        val updatedRecords: Int,
        val unchangedRecords: Int,
        val totalRecords: Int,
        val duration: RefreshResultDuration,
        val balances: List<AccountBalance>
) : Parcelable

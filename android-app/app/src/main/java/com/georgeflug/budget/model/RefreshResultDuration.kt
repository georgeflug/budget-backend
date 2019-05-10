package com.georgeflug.budget.model

import android.os.Parcelable
import kotlinx.android.parcel.Parcelize

@Parcelize
data class RefreshResultDuration(
        val total: String, // eg. "51.49 seconds"
        val transactions: String, // eg. "41.163 seconds"
        val balance: String // eg. "10.327 seconds"
) : Parcelable

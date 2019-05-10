package com.georgeflug.budget.model

import android.os.Parcelable
import kotlinx.android.parcel.Parcelize
import java.math.BigDecimal

@Parcelize
data class AccountBalance(
        val accountId: String, // eg. "o3d3dPnELRtY7gEPPaBVsbZkDqJeQLCB680A5"
        val balance: BigDecimal, // eg. 1777.97
        val date: String, // eg. "2019-05-10T00:37:20.780Z"
        val name: String // eg. "First Community Checking"
) : Parcelable

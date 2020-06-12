package com.georgeflug.budget.plaidlink

import io.reactivex.Single
import retrofit2.http.GET

interface CheckAccountApi {
    @GET("check-account-connectivity")
    fun checkAccountConnectivity(): Single<List<CheckAccountResult>>
}

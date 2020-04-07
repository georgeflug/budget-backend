package com.georgeflug.budget.plaidlink

import io.reactivex.Observable
import retrofit2.http.GET

interface CheckAccountApi {
    @GET("check-account-connectivity")
    fun checkAccountConnectivity(): Observable<List<CheckAccountResult>>
}

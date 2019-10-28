package com.georgeflug.budget.api

import com.georgeflug.budget.model.BackendStatus
import io.reactivex.Observable
import retrofit2.http.GET

interface StatusApi {
    @GET("status")
    fun getStatus(): Observable<BackendStatus>
}

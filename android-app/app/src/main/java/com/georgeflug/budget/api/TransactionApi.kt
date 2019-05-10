package com.georgeflug.budget.api

import com.georgeflug.budget.model.NewTransaction
import com.georgeflug.budget.model.RefreshResult
import com.georgeflug.budget.model.Transaction
import io.reactivex.Observable
import retrofit2.http.Body
import retrofit2.http.DELETE
import retrofit2.http.GET
import retrofit2.http.POST
import retrofit2.http.PUT
import retrofit2.http.Path
import retrofit2.http.Query

interface TransactionApi {
    @GET("transactions")
    fun listTransactions(@Query("startingAt") startingAt: String?): Observable<List<Transaction>>

    @POST("transactions")
    fun createTransaction(@Body transaction: NewTransaction): Observable<Transaction>

    @GET("transactions/{id}")
    fun getTransaction(@Path("id") id: String): Observable<Transaction>

    @PUT("transactions/{id}")
    fun updateTransaction(@Path("id") id: String, @Body transaction: Transaction): Observable<Transaction>

    @DELETE("transactions/{id}")
    fun deleteTransactions(@Path("id") id: String): Observable<List<Transaction>>

    @POST("refresh")
    fun refreshTransactions(): Observable<RefreshResult>

}

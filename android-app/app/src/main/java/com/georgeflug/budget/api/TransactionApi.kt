package com.georgeflug.budget.api

import com.georgeflug.budget.api.model.NewTransaction
import com.georgeflug.budget.api.model.Transaction
import io.reactivex.Observable
import retrofit2.http.*

interface TransactionApi {
    @GET("transactions")
    fun listTransactions(): Observable<List<Transaction>>

    @POST("transactions")
    fun createTransaction(@Body transaction: NewTransaction): Observable<Transaction>

    @GET("transactions/{id}")
    fun getTransaction(@Path("id") id: String): Observable<Transaction>

    @PUT("transactions/{id}")
    fun updateTransaction(@Path("id") id: String, @Body transaction: Transaction): Observable<Transaction>

    @DELETE("transactions/{id}")
    fun deleteTransactions(@Path("id") id: String): Observable<List<Transaction>>
}

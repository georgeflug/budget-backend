package com.georgeflug.budget.api

import com.georgeflug.budget.model.NewTransaction
import com.georgeflug.budget.model.RefreshResult
import com.georgeflug.budget.model.Transaction
import com.georgeflug.budget.model.TransactionUpdateRequest
import io.reactivex.Single
import retrofit2.http.Body
import retrofit2.http.DELETE
import retrofit2.http.GET
import retrofit2.http.POST
import retrofit2.http.PUT
import retrofit2.http.Path
import retrofit2.http.Query

interface TransactionApi {
    @GET("transactions")
    fun listTransactions(@Query("startingAt") startingAt: String?): Single<List<Transaction>>

    @POST("transactions")
    fun createTransaction(@Body transaction: NewTransaction): Single<Transaction>

    @GET("transactions/{id}")
    fun getTransaction(@Path("id") id: Int): Single<Transaction>

    @PUT("transactions/{id}")
    fun updateTransaction(@Path("id") id: Int, @Body transaction: TransactionUpdateRequest): Single<Transaction>

    @DELETE("transactions/{id}")
    fun deleteTransactions(@Path("id") id: Int): Single<List<Transaction>>

    @POST("refresh")
    fun refreshTransactions(): Single<RefreshResult>

}

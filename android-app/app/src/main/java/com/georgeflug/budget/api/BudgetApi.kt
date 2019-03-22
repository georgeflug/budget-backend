package com.georgeflug.budget.api

import com.georgeflug.budget.api.okhttp.CustomClient
import io.reactivex.schedulers.Schedulers
import retrofit2.Retrofit
import retrofit2.adapter.rxjava2.RxJava2CallAdapterFactory
import retrofit2.converter.gson.GsonConverterFactory

object BudgetApi {
    private val retrofit = Retrofit.Builder()
            .client(CustomClient().createClient())
            .baseUrl("https://10.0.2.2:3000")
            .addConverterFactory(GsonConverterFactory.create())
            .addCallAdapterFactory(RxJava2CallAdapterFactory.createWithScheduler(Schedulers.io()))
            .build()

    val transactions: TransactionApi = retrofit.create(TransactionApi::class.java)
    val featureIdeas: FeatureApi = retrofit.create(FeatureApi::class.java)
}

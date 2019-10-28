package com.georgeflug.budget.api

import com.fasterxml.jackson.databind.DeserializationFeature
import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.module.kotlin.registerKotlinModule
import com.georgeflug.budget.api.okhttp.CustomClient
import io.reactivex.schedulers.Schedulers
import retrofit2.Retrofit
import retrofit2.adapter.rxjava2.RxJava2CallAdapterFactory
import retrofit2.converter.jackson.JacksonConverterFactory


object BudgetApi {
    private val objectMapper = ObjectMapper().registerKotlinModule()
            .configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false)

    private val retrofit = Retrofit.Builder()
            .client(CustomClient().createClient())
            .baseUrl("https://thisWillBeReplacedByHostInterceptor")
            .addConverterFactory(JacksonConverterFactory.create(objectMapper))
            .addCallAdapterFactory(RxJava2CallAdapterFactory.createWithScheduler(Schedulers.io()))
            .build()

    val transactions: TransactionApi = retrofit.create(TransactionApi::class.java)
    val featureIdeas: FeatureApi = retrofit.create(FeatureApi::class.java)
    val statusApi: StatusApi = retrofit.create(StatusApi::class.java)
}

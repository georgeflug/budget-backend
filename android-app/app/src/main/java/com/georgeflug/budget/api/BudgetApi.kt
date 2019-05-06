package com.georgeflug.budget.api

import android.content.Context
import android.net.wifi.WifiManager
import android.os.Build
import com.fasterxml.jackson.databind.DeserializationFeature
import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.module.kotlin.registerKotlinModule
import com.georgeflug.budget.BudgetApplication
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
            .baseUrl(getBaseUrl())
            .addConverterFactory(JacksonConverterFactory.create(objectMapper))
            .addCallAdapterFactory(RxJava2CallAdapterFactory.createWithScheduler(Schedulers.io()))
            .build()

    val transactions: TransactionApi = retrofit.create(TransactionApi::class.java)
    val featureIdeas: FeatureApi = retrofit.create(FeatureApi::class.java)

    private fun getBaseUrl() = "https://${getHost()}:3000"

    private fun getHost() = when {
        isEmulator() -> "10.0.2.2"
        isHomeNetwork() -> "192.168.1.132"
        else -> "georgeflug.duckdns.org"
    }

    fun isEmulator(): Boolean = Build.FINGERPRINT.contains("generic")

    fun isHomeNetwork(): Boolean {
        val wifiMgr = BudgetApplication.getAppContext().getSystemService(Context.WIFI_SERVICE) as WifiManager
        val wifiInfo = wifiMgr.connectionInfo
        return wifiInfo.ssid == "\"221B Baker Street\""
    }
}

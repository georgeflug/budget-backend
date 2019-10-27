package com.georgeflug.budget.api.okhttp

import android.content.Context
import android.net.wifi.WifiManager
import android.os.Build
import com.georgeflug.budget.BudgetApplication
import okhttp3.Interceptor
import okhttp3.Response
import timber.log.Timber

class HostInterceptor : Interceptor {
    override fun intercept(chain: Interceptor.Chain): Response {
        val requestWithNewHost = chain.request()
                .newBuilder()
                .url(getNewUrl(chain.request().url().encodedPath()))
                .build()

        return chain.proceed(requestWithNewHost)
    }

    private fun getNewUrl(path: String) = "https://${getHost()}:3000$path".also {
        Timber.d("Requesting: $it")
    }

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

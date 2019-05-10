package com.georgeflug.budget.api.okhttp

import okhttp3.OkHttpClient
import java.time.Duration
import javax.net.ssl.SSLContext
import javax.net.ssl.SSLSocketFactory
import javax.net.ssl.X509TrustManager

class CustomClient {

    fun createClient(): OkHttpClient {
        val trustManager = CustomTrustManager().createTrustManager()
        val sslSocketFactory = getCustomSslSocketFactory(trustManager)
        val hostNameVerifier = CustomHostNameVerifier()
        val authInterceptor = AuthInterceptor()

        return OkHttpClient.Builder()
                .hostnameVerifier(hostNameVerifier)
                .addInterceptor(authInterceptor)
                .sslSocketFactory(sslSocketFactory, trustManager)
                .readTimeout(Duration.ofSeconds(60))
                .build()
    }

    private fun getCustomSslSocketFactory(trustManager: X509TrustManager): SSLSocketFactory {
        val sslContext = SSLContext.getInstance("TLS")
        sslContext.init(null, arrayOf(trustManager), null)
        return sslContext.socketFactory
    }
}

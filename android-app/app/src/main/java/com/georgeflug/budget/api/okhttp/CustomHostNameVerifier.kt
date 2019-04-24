package com.georgeflug.budget.api.okhttp

import javax.net.ssl.HostnameVerifier
import javax.net.ssl.SSLSession

class CustomHostNameVerifier : HostnameVerifier {
    private val localHost = "10.0.2.2"
    private val realHost = "georgeflug.duckdns.org"
    private val realLocalNetworkHost = "192.168.1.132"

    override fun verify(hostname: String, session: SSLSession): Boolean {
        return hostname == localHost || hostname == realHost || hostname == realLocalNetworkHost
    }
}

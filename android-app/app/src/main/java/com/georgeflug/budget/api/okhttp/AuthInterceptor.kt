package com.georgeflug.budget.api.okhttp

import com.georgeflug.budget.BudgetApplication
import com.georgeflug.budget.R
import okhttp3.Credentials
import okhttp3.Interceptor
import okhttp3.Response

class AuthInterceptor : Interceptor {
    override fun intercept(chain: Interceptor.Chain): Response {
        // If user_name and password are unresolved, then add them to a new resource file src/main/res/values/secrets.xml
        val username = BudgetApplication.getAppContext().getString(R.string.user_name) // read comment above
        val password = BudgetApplication.getAppContext().getString(R.string.password) // read comment above
        val credentials: String = Credentials.basic(username, password)

        val authenticatedRequest = chain.request()
                .newBuilder()
                .header("Authorization", credentials)
                .build()
        return chain.proceed(authenticatedRequest)
    }
}

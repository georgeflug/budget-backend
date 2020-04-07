package com.georgeflug.budget

import android.app.Application
import android.content.Context
import com.georgeflug.budget.logging.LogToFileTree
import com.plaid.link.Plaid
import com.plaid.linkbase.models.configuration.PlaidEnvironment
import com.plaid.linkbase.models.configuration.PlaidOptions
import com.plaid.log.LogLevel
import timber.log.Timber
import timber.log.Timber.DebugTree


class BudgetApplication : Application() {

    companion object {
        private lateinit var context: Context

        fun getAppContext(): Context {
            return context
        }
    }

    override fun onCreate() {
        super.onCreate()
        Timber.plant(DebugTree())
        Timber.plant(LogToFileTree())

        context = applicationContext
        Timber.d("onCreate()")

        Plaid.setOptions(PlaidOptions(
                logLevel = LogLevel.ASSERT,
                environment = PlaidEnvironment.DEVELOPMENT
        ))
    }
}
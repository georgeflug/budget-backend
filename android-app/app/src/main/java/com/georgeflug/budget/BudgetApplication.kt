package com.georgeflug.budget

import android.app.Application
import android.content.Context
import com.georgeflug.budget.dailyreminder.DailyReminderNotificationChannelInitializer
import com.georgeflug.budget.logging.LogToFileTree
import com.georgeflug.budget.service.TransactionService
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

        Timber.d("onCreate()")
        context = applicationContext
        TransactionService.downloadTransactions()
        DailyReminderNotificationChannelInitializer().registerChannel(context)
    }
}
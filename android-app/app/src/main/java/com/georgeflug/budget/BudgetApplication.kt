package com.georgeflug.budget

import android.app.Application
import android.content.Context
import android.util.Log
import com.georgeflug.budget.dailyreminder.DailyReminderNotificationChannelInitializer
import com.georgeflug.budget.dailyreminder.DailyReminderScheduler
import com.georgeflug.budget.service.TransactionService

class BudgetApplication : Application() {

    companion object {
        private lateinit var context: Context

        fun getAppContext(): Context {
            return context
        }
    }

    override fun onCreate() {
        super.onCreate()
        Log.d("BudgetApplication", "Application.onCreate()")
        context = applicationContext
        TransactionService.downloadTransactions()
        DailyReminderScheduler().scheduleReminder(context)
        DailyReminderNotificationChannelInitializer().registerChannel(context)
    }
}
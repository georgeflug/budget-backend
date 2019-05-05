package com.georgeflug.budget

import android.app.Application
import android.content.Context
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
        context = applicationContext
        TransactionService.downloadTransactions()
    }
}
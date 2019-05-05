package com.georgeflug.budget

import android.app.Application
import android.content.Context
import android.widget.Toast
import com.georgeflug.budget.api.BudgetApi

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
        Toast.makeText(context, "isHomeNetwork: " + BudgetApi.isHomeNetwork() + ", Name: " + BudgetApi.homeNetworkName(), Toast.LENGTH_LONG).show()
//        TransactionService.downloadTransactions()
    }
}
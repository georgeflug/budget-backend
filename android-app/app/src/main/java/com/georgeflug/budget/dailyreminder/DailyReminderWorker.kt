package com.georgeflug.budget.dailyreminder

import android.content.Context
import android.support.v4.app.NotificationCompat
import androidx.work.Worker
import androidx.work.WorkerParameters
import com.georgeflug.budget.R
import com.georgeflug.budget.api.BudgetApi
import com.georgeflug.budget.model.Budget
import com.georgeflug.budget.model.Transaction
import com.georgeflug.budget.service.PersistedTransactionService
import com.georgeflug.budget.util.getNotificationManager

class DailyReminderWorker(appContext: Context, workerParams: WorkerParameters)
    : Worker(appContext, workerParams) {

    override fun doWork(): Result {
        val persistedTransactions = PersistedTransactionService.getPersistedTransactions()
        val latestTimestamp = PersistedTransactionService.getLatestTimestamp(persistedTransactions)
        BudgetApi.transactions.refreshTransactions().blockingSubscribe()
        val newTransactions = BudgetApi.transactions.listTransactions(latestTimestamp).blockingFirst()

        val initialUncategorizedCount = persistedTransactions.count { it.isUncategorized() }
        val newUncategorizedCount = newTransactions.count { it.isUncategorized() }

        if (newUncategorizedCount > 0) sendNotification(initialUncategorizedCount, newUncategorizedCount)

        DailyReminderScheduler().scheduleReminder(applicationContext)
        return Result.success()
    }

    private fun sendNotification(initialUncategorizedCount: Int, newTransactions: Int) {
        val message = "$newTransactions new transaction${if (newTransactions == 1) "" else "s"} to categorize " +
                "and $initialUncategorizedCount old one${if (initialUncategorizedCount == 1) "" else "s"}"

        // send notification
        val notification = NotificationCompat.Builder(applicationContext, DailyReminderNotificationChannelInitializer.CHANNEL_ID)
                .setContentTitle("New Transactions")
                .setContentText(message)
                .setPriority(NotificationCompat.PRIORITY_DEFAULT)
                .setSmallIcon(R.drawable.ic_attach_money_black_24dp)
                .build()

        applicationContext.getNotificationManager().notify(1, notification)
    }

    private fun Transaction.isUncategorized() = this.splits.any { split -> split.realBudget == Budget.UNKNOWN }

}
package com.georgeflug.budget.dailyreminder

import android.content.Context
import android.util.Log
import androidx.work.*
import java.time.Duration
import java.time.LocalTime

class DailyReminderScheduler {
    companion object {
        private const val WORK_NAME = "budgetReminderWork"
        private val TAG = DailyReminderScheduler::class.java.simpleName
    }

    fun scheduleReminder(context: Context) {
        val settings = DailyReminderSettings(context)
        if (settings.enabled) scheduleReminder(settings.timeOfDay)
    }

    fun scheduleReminder(timeOfDay: LocalTime) {
        Log.d(TAG, "Scheduling next reminder at: $timeOfDay")
        val timeBetween = Duration.between(LocalTime.now(), timeOfDay)
        val timeUntilReminder = if (timeBetween.seconds > 0) timeBetween else Duration.ofDays(1).plus(timeBetween)

        val reminderRequest = OneTimeWorkRequestBuilder<DailyReminderWorker>()
                .setInitialDelay(timeUntilReminder)
                .build()

        WorkManager.getInstance().enqueueUniqueWork(
                WORK_NAME, ExistingWorkPolicy.REPLACE, reminderRequest)
    }

    fun cancelReminder() {
        WorkManager.getInstance().cancelUniqueWork(WORK_NAME)
    }
}
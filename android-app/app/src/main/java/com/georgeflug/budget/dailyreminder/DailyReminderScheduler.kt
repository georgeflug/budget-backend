package com.georgeflug.budget.dailyreminder

import androidx.work.*
import java.time.Duration
import java.time.LocalTime

class DailyReminderScheduler {
    companion object {
        private const val WORK_NAME = "budgetReminderWork"
    }

    fun scheduleReminder(timeOfDay: LocalTime) {
        val timeUntilFirstReminder = Duration.between(LocalTime.now(), timeOfDay)
        val reminderRequest = OneTimeWorkRequestBuilder<DailyReminderWorker>()
                .setInitialDelay(timeUntilFirstReminder)
                .build()

        WorkManager.getInstance().enqueueUniqueWork(
                WORK_NAME, ExistingWorkPolicy.REPLACE, reminderRequest)
    }
}
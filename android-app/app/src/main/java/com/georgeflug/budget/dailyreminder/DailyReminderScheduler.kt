package com.georgeflug.budget.dailyreminder

import android.content.Context
import android.support.annotation.VisibleForTesting
import androidx.work.ExistingWorkPolicy
import androidx.work.OneTimeWorkRequestBuilder
import androidx.work.WorkManager
import timber.log.Timber
import java.time.Duration
import java.time.LocalTime

class DailyReminderScheduler {
    companion object {
        private const val WORK_NAME = "budgetReminderWork"
    }

    fun scheduleReminder(context: Context) {
        val settings = DailyReminderSettings(context)
        if (settings.enabled) scheduleReminder(settings.timeOfDay)
    }

    fun scheduleReminder(timeOfDay: LocalTime) {
        val day = if (Duration.between(LocalTime.now(), timeOfDay).seconds > 0) "today" else "tomorrow"
        Timber.d("Scheduling next reminder at: $timeOfDay $day")
        val reminderRequest = OneTimeWorkRequestBuilder<DailyReminderWorker>()
                .setInitialDelay(getTimeUntilReminder(timeOfDay))
                .build()

        WorkManager.getInstance().enqueueUniqueWork(
                WORK_NAME, ExistingWorkPolicy.REPLACE, reminderRequest)
    }

    fun cancelReminder() {
        WorkManager.getInstance().cancelUniqueWork(WORK_NAME)
    }

    private fun getTimeUntilReminder(reminderTime: LocalTime) = getTimeUntilReminder(LocalTime.now(), reminderTime)

    @VisibleForTesting
    fun getTimeUntilReminder(currentTime: LocalTime, reminderTime: LocalTime): Duration {
        val timeBetween = Duration.between(currentTime, reminderTime)
        return if (timeBetween.seconds > 0) timeBetween else Duration.ofDays(1).plus(timeBetween)
    }
}
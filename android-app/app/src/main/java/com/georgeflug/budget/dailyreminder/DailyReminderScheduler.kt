package com.georgeflug.budget.dailyreminder

import android.app.AlarmManager
import android.app.PendingIntent
import android.content.Context
import android.content.Context.ALARM_SERVICE
import android.content.Intent
import androidx.annotation.VisibleForTesting
import timber.log.Timber
import java.time.Duration
import java.time.LocalTime

class DailyReminderScheduler {
    companion object {
        private const val WORK_NAME = "budgetReminderWork"
    }

    fun scheduleReminder(context: Context) {
        val settings = DailyReminderSettings(context)
        if (settings.enabled) scheduleReminder(context, settings.timeOfDay)
    }

    fun scheduleReminder(context: Context, timeOfDay: LocalTime) {
        val day = if (isNextAlarmToday(timeOfDay)) "today" else "tomorrow"
        val millisUntilReminder = getTimeUntilReminder(timeOfDay).toMillis()
        Timber.d("Scheduling next reminder at $timeOfDay $day ($millisUntilReminder millis from now)")
        getAlarmManager(context).set(AlarmManager.RTC_WAKEUP, System.currentTimeMillis() + millisUntilReminder, getAlarmIntent(context))
    }

    fun cancelReminder(context: Context) {
        getAlarmManager(context).cancel(getAlarmIntent(context))
    }

    private fun getTimeUntilReminder(reminderTime: LocalTime) = getTimeUntilReminder(LocalTime.now(), reminderTime)

    @VisibleForTesting
    fun getTimeUntilReminder(currentTime: LocalTime, reminderTime: LocalTime): Duration {
        val timeBetween = Duration.between(currentTime, reminderTime)
        return if (isNextAlarmToday(currentTime, reminderTime)) timeBetween else Duration.ofDays(1).plus(timeBetween)
    }

    private fun isNextAlarmToday(timeOfDay: LocalTime) = isNextAlarmToday(LocalTime.now(), timeOfDay)
    private fun isNextAlarmToday(currentTime: LocalTime, timeOfDay: LocalTime) =
            Duration.between(currentTime, timeOfDay).toMillis() > 0

    private fun getAlarmManager(context: Context) =
            context.getSystemService(ALARM_SERVICE) as AlarmManager

    private fun getAlarmIntent(context: Context): PendingIntent? {
        val intent = Intent(context, DailyReminderWorker::class.java)
        val alarmIntent = PendingIntent.getBroadcast(context, 0, intent, 0)
        return alarmIntent
    }
}
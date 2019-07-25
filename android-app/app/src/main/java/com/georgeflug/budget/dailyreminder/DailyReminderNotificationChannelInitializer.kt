package com.georgeflug.budget.dailyreminder

import android.app.NotificationChannel
import android.app.NotificationManager
import android.content.Context
import com.georgeflug.budget.util.getNotificationManager

class DailyReminderNotificationChannelInitializer {
    companion object {
        const val CHANNEL_ID = "com.georgeflug.budget.dailyreminder.channel"
        private const val CHANNEL_NAME = "Daily Reminder"
        private const val CHANNEL_DESCRIPTION = "Notifications for daily reminders to categorize budgets"
    }

    fun registerChannel(context: Context) {
        val channel = NotificationChannel(CHANNEL_ID, CHANNEL_NAME, NotificationManager.IMPORTANCE_DEFAULT)
        channel.description = CHANNEL_DESCRIPTION
        context.getNotificationManager().createNotificationChannel(channel)
    }
}
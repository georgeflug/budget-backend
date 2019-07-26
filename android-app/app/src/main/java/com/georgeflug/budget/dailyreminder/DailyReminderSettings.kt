package com.georgeflug.budget.dailyreminder

import android.content.Context
import java.time.LocalTime

class DailyReminderSettings(context: Context) {
    companion object {
        private const val PREFERENCES_NAME = "reminderPreferences"
        private const val ENABLED_PROP = "reminderEnabled"
        private const val HOUR_OF_DAY_PROP = "reminderHourOfDay"
        private const val MINUTE_OF_DAY_PROP = "reminderMinuteOfDay"

        private const val DEFAULT_ENABLED = true
        private const val DEFAULT_HOUR = 20 // 8:00 PM
        private const val DEFAULT_MINUTE = 0
    }

    private val preferences = context.getSharedPreferences(PREFERENCES_NAME, Context.MODE_PRIVATE)

    var enabled
        get() = preferences.getBoolean(ENABLED_PROP, DEFAULT_ENABLED)
        set(value) = preferences.edit().putBoolean(ENABLED_PROP, value).apply()

    var timeOfDay
        get() = LocalTime.of(
                preferences.getInt(HOUR_OF_DAY_PROP, DEFAULT_HOUR),
                preferences.getInt(MINUTE_OF_DAY_PROP, DEFAULT_MINUTE),
                0)
        set(value) = preferences.edit()
                .putInt(HOUR_OF_DAY_PROP, value.hour)
                .putInt(MINUTE_OF_DAY_PROP, value.minute)
                .apply()

}
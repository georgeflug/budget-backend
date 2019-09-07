package com.georgeflug.budget.dailyreminder

import org.junit.Assert.assertEquals
import org.junit.Test

import java.time.LocalTime

class DailyReminderSchedulerTest {

    @Test
    fun getTimeUntilReminder_WhenTimeIsAfterCurrentTimeOfDay() {
        val currentTime = LocalTime.of(14, 0, 0)
        val futureTime = LocalTime.of(16, 0, 0)

        val timeUntil = DailyReminderScheduler().getTimeUntilReminder(currentTime, futureTime);

        assertEquals(2, timeUntil.toHours())
    }

    @Test
    fun getTimeUntilReminder_WhenTimeIsBeforeCurrentTimeOfDay() {
        val currentTime = LocalTime.of(14, 0, 0)
        val pastTime = LocalTime.of(12, 0, 0)

        val timeUntil = DailyReminderScheduler().getTimeUntilReminder(currentTime, pastTime)

        assertEquals(22, timeUntil.toHours())
    }
}
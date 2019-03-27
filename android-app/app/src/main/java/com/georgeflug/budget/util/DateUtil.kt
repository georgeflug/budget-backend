package com.georgeflug.budget.util

import java.time.LocalDate
import java.time.Month
import java.time.format.DateTimeFormatter
import java.util.Locale

class DateUtil {
    companion object {
        // api date example: 2018-09-17T05:00:00.0000Z
        private val cleanedDateFormat = DateTimeFormatter.ISO_LOCAL_DATE // yyyy-MM-dd
        private val printedDateFormat = DateTimeFormatter.ofPattern("EEEE, MMMM d", Locale.US)
        private val monthAndDayFormat = DateTimeFormatter.ofPattern("MMMM d", Locale.US)

        val firstDay = LocalDate.of(2018, Month.SEPTEMBER, 1)

        fun parseDate(date: String): LocalDate {
            val dateOnly = cleanupDate(date)
            return LocalDate.parse(dateOnly, cleanedDateFormat)
        }

        fun dateToString(date: LocalDate): String {
            return date.format(cleanedDateFormat)
        }

        fun getFriendlyDate(date: LocalDate): String {
            val today = LocalDate.now()
            val yesterday = today.minusDays(1)

            return when (date) {
                today -> "Today, " + date.format(monthAndDayFormat)
                yesterday -> "Yesterday, " + date.format(monthAndDayFormat)
                else -> date.format(printedDateFormat)
            }
        }

        fun getToday(): String = LocalDate.now().format(cleanedDateFormat)

        private fun cleanupDate(apiDate: String): String {
            return apiDate.takeWhile { char -> char != 'T' }
        }
    }
}

package com.georgeflug.budget.util

import java.time.LocalDate
import java.time.format.DateTimeFormatter
import java.util.*

class DateUtil {
    companion object {
        // api date example: 2018-09-17T05:00:00.0000Z
        private val cleanedDateFormat = DateTimeFormatter.ISO_LOCAL_DATE // yyyy-MM-dd
        private val printedDateFormat = DateTimeFormatter.ofPattern("EEEE, MMMM d", Locale.US)
        private val monthAndDayFormat = DateTimeFormatter.ofPattern("MMMM d", Locale.US)

        fun parseDate(date: String): LocalDate {
            val dateOnly = cleanupDate(date)
            return LocalDate.parse(dateOnly, cleanedDateFormat)
        }

        fun cleanupDate(apiDate: String): String {
            return apiDate.takeWhile { char -> char != 'T' }
        }

        fun getFriendlyDate(date: String): String {
            val actualDate = parseDate(date)
            val today = LocalDate.now()
            val yesterday = today.minusDays(1)

            return when(actualDate) {
                today -> "Today, " + actualDate.format(monthAndDayFormat)
                yesterday -> "Yesterday, " + actualDate.format(monthAndDayFormat)
                else -> actualDate.format(printedDateFormat)
            }
        }

        fun getToday(): String = LocalDate.now().format(cleanedDateFormat)

    }
}

package com.georgeflug.budget.util

import java.time.LocalDate
import java.time.format.DateTimeFormatter
import java.util.*

class DateUtil {
    companion object {
        // api date example: 2018-09-17T05:00:00.0000Z
        private val cleanedDateFormat = DateTimeFormatter.ISO_LOCAL_DATE // yyyy-MM-dd
        private val dayOfWeekFormat = DateTimeFormatter.ofPattern("EEEE", Locale.US)
        private val printedDateFormat = DateTimeFormatter.ofPattern("EEEE, MMMM d", Locale.US)

        fun cleanupDate(apiDate: String): String {
            return apiDate.takeWhile { char -> char != 'T' }
        }

        fun getFriendlyDate(date: String): String {
            val dateOnly = cleanupDate(date)
            val actualDate = LocalDate.parse(dateOnly, cleanedDateFormat)
            val today = LocalDate.now()
            val yesterday = today.minusDays(1)
            val aWeekAgo = today.minusDays(6)

            return when(actualDate) {
                today -> "Today"
                yesterday -> "Yesterday"
                else -> actualDate.format(if (actualDate.isBefore(aWeekAgo)) printedDateFormat else dayOfWeekFormat)
            }
        }

    }
}
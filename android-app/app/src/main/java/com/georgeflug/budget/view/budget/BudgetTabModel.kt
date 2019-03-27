package com.georgeflug.budget.view.budget

import com.georgeflug.budget.util.DateUtil
import java.time.LocalDate
import java.time.Period
import java.time.format.DateTimeFormatter
import java.util.Locale

class BudgetTabModel {
    val monthFormat = DateTimeFormatter.ofPattern("MMM", Locale.US)
    val monthAndYearFormat = DateTimeFormatter.ofPattern("MMM YYYY", Locale.US)

    data class MonthAndName(val month: LocalDate, val name: String)

    fun getBudgetMonths(): List<MonthAndName> {
        var month = DateUtil.firstDay
        val lastMonth = LocalDate.now()

        val result = ArrayList<MonthAndName>()
        while (month <= lastMonth) {
            val tabText = if (Period.between(month, lastMonth).years == 0) {
                monthFormat.format(month)
            } else {
                monthAndYearFormat.format(month)
            }
            result.add(MonthAndName(month, tabText))
            month = month.plusMonths(1)
        }

        return result
    }

}
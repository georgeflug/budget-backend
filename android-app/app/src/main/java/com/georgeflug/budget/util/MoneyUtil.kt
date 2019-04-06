package com.georgeflug.budget.util

import java.math.BigDecimal
import java.text.NumberFormat

object MoneyUtil {
    fun format(money: BigDecimal): String {
        val formatter = NumberFormat.getCurrencyInstance()
        return formatter.format(money)
    }
}
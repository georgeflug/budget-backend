package com.georgeflug.budget.model

import java.time.LocalDate

data class BudgetAmount(
        val category: Budget,
        val amount: Int,
        val startDate: LocalDate
)

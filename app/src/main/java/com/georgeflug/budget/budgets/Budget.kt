package com.georgeflug.budget.budgets

import java.math.BigDecimal

enum class Budget(val title: String, val description: String, val amount: BigDecimal?) {
    RICHIE("Richie", "", BigDecimal(120)),
    STEF("Stef", "", BigDecimal(120)),
    BEN("Ben", "",null),
    BIG_NECESSITIES("Big Necessities", "Health bills, car repairs, house repairs", null),
    CHARITY("Charity", "", null),
    CLOTHES("Clothes", "Clothes, hair, makeup", BigDecimal(70)),
    ENTERTAINMENT("Entertainment", "Restaurants, bars, food, movies, outings, etc", BigDecimal(150)),
    GROCERIES("Groceries", "", BigDecimal(400)),
    MORTGAGE("Mortgage", "", null),
    OPTIONAL_IMPORTANT("Optional Important", "Gifts, optional house improvements, Christmas cards & gifts, photo books", null),
    GIFTS("Gifts", "", null),
    CHRISTMAS("Christmas", "", null),
    RICHIE_PROJECTS("Richie - Projects", "", null),
    STUDENT_LOAN("Student Loan", "", null),
    SUBSCRIPTIONS("Subscriptions", "Insurance, Netflix, Amazon, Gym", null),
    HOME_SUPPLIES("Home Supplies", "", null),
    TRAVEL("Travel", "", null),
    UTILITIES("Utilities", "Internet, Phones, Electric, Water, Trash", null);

    fun hasAmount() = amount != BigDecimal.ZERO

    companion object {
        fun lookup(title: String): Budget? {
            return Budget.values().find { it.title == title }
        }
    }
}





















package com.georgeflug.budget

import java.math.BigDecimal

enum class Budget(val title: String, val description: String, val amount: BigDecimal) {
    RICHIE("Richie", "", BigDecimal(120)),
    STEF("Stef", "", BigDecimal(120)),
    BEN("Ben", "", BigDecimal(0)),
    BIG_NECESSITIES("Big Necessities", "Health bills, car repairs, house repairs", BigDecimal(0)),
    CHARITY("Charity", "", BigDecimal(0)),
    CLOTHES("Clothes", "Clothes, hair, makeup", BigDecimal(70)),
    ENTERTAINMENT("Entertainment", "Restaurants, bars, food, movies, outings, etc", BigDecimal(150)),
    GROCERIES("Groceries", "", BigDecimal(400)),
    MORTGAGE("Mortgage", "", BigDecimal(0)),
    OPTIONAL_IMPORTANT("Optional Important", "Gifts, optional house improvements, Christmas cards & gifts, photo books", BigDecimal(0)),
    GIFTS("Gifts", "", BigDecimal(0)),
    CHRISTMAS("Christmas", "", BigDecimal(0)),
    RICHIE_PROJECTS("Richie - Projects", "", BigDecimal(0)),
    STUDENT_LOAN("Student Loan", "", BigDecimal(0)),
    SUBSCRIPTIONS("Subscriptions", "Insurance, Netflix, Amazon, Gym", BigDecimal(0)),
    HOME_SUPPLIES("Home Supplies", "", BigDecimal(0)),
    TRAVEL("Travel", "", BigDecimal(0)),
    UTILITIES("Utilities", "Internet, Phones, Electric, Water, Trash", BigDecimal(0));
}





















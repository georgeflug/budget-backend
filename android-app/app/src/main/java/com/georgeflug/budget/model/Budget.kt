package com.georgeflug.budget.model

import android.support.annotation.DrawableRes
import com.georgeflug.budget.R
import java.math.BigDecimal

enum class Budget(
        val title: String,
        val description: String,
        val amount: BigDecimal?,
        @DrawableRes val iconId: Int,
        val isAutomatic: Boolean,
        val askForDescription: Boolean) {
    RICHIE("Richie", "", BigDecimal(120), R.drawable.ic_icons8_user_male, false, true),
    STEF("Stef", "", BigDecimal(120), R.drawable.ic_icons8_female_user, false, true),
    BEN("Ben", "", null, R.drawable.ic_icons8_babys_room, false, true),
    CLOTHES("Clothes", "Clothes, hair, makeup", BigDecimal(70), R.drawable.ic_icons8_tshirt, false, true),
    GROCERIES("Groceries", "", BigDecimal(400), R.drawable.ic_icons8_bread, false, false),
    ENTERTAINMENT("Entertainment", "Restaurants, bars, food, movies, outings, etc", BigDecimal(150), R.drawable.ic_icons8_beer, false, true),
    HOME_SUPPLIES("Home Supplies", "", null, R.drawable.ic_icons8_house, false, true),
    GIFTS("Gifts", "", null, R.drawable.ic_icons8_gift, false, true),
    BIG_NECESSITIES("Big Necessities", "Health bills, car repairs, house repairs", null, R.drawable.ic_healing_black_24dp, false, true),
    OPTIONAL_IMPORTANT("Optional Important", "Gifts, optional house improvements, Christmas cards & gifts, photo books", null, R.drawable.ic_icons8_approve, false, true),
    TRAVEL("Travel", "", null, R.drawable.ic_icons8_airplane_mode_on, false, true),
    CHRISTMAS("Christmas", "", null, R.drawable.ic_icons8_christmas_tree, false, true),
    CHARITY("Charity", "", null, R.drawable.ic_icons8_charity, false, false),
    RICHIE_PROJECTS("Richie Projects", "", null, R.drawable.ic_icons8_science_fiction, false, true),
    UNKNOWN("To be determined", "", null, R.drawable.ic_help_outline_black_24dp, false, true),
    WORK_TRIPS("Work Expenses", "Expenses and trips that are reimbursed by our jobs", null, R.drawable.ic_work_black_24dp, false, true),
    GAS("Gas", "", null, R.drawable.ic_local_gas_station_black_24dp, false, false),
    INCOME("Income", "", null, R.drawable.ic_attach_money_black_24dp, false, false),
    MORTGAGE("Mortgage", "", null, R.drawable.ic_icons8_real_estate, false, false),
    STUDENT_LOAN("Student Loan", "", null, R.drawable.ic_icons8_graduation_cap, false, false),
    SUBSCRIPTIONS("Subscriptions", "Insurance, Netflix, Amazon, Gym", null, R.drawable.ic_icons8_play_button_on_tv, false, false),
    UTILITIES("Utilities", "Internet, Phones, Electric, Water, Trash", null, R.drawable.ic_icons8_water_pipe, false, false);

    fun hasAmount() = amount != null && amount != BigDecimal.ZERO

    companion object {
        fun lookupOrUnknown(title: String): Budget {
            return lookup(title) ?: Budget.UNKNOWN
        }

        fun lookup(title: String): Budget? {
            return Budget.values().find { it.title == title }
        }
    }
}





















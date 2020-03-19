package com.georgeflug.budget.model

import androidx.annotation.DrawableRes
import com.georgeflug.budget.R

enum class Budget(
        val title: String,
        val description: String,
        @DrawableRes val iconId: Int,
        val askForDescription: Boolean) {
    RICHIE("Richie", "", R.drawable.ic_icons8_user_male, true),
    STEF("Stef", "", R.drawable.ic_icons8_female_user, true),
    BEN("Ben", "", R.drawable.ic_icons8_babys_room, true),
    CLOTHES("Clothes", "Clothes, hair, makeup", R.drawable.ic_icons8_tshirt, true),
    GROCERIES("Groceries", "", R.drawable.ic_icons8_bread, false),
    ENTERTAINMENT("Entertainment", "Restaurants, bars, food, movies, outings, etc", R.drawable.ic_icons8_beer, true),
    HOME_SUPPLIES("Home Supplies", "", R.drawable.ic_icons8_house, true),
    GIFTS("Gifts", "", R.drawable.ic_icons8_gift, true),
    BIG_NECESSITIES("Big Necessities", "Health bills, car repairs, house repairs", R.drawable.ic_healing_black_24dp, true),
    OPTIONAL_IMPORTANT("Optional Important", "Gifts, optional house improvements, Christmas cards & gifts, photo books", R.drawable.ic_icons8_approve, true),
    TRAVEL("Travel", "", R.drawable.ic_icons8_airplane_mode_on, true),
    CHRISTMAS("Christmas", "", R.drawable.ic_icons8_christmas_tree, true),
    CHARITY("Charity", "", R.drawable.ic_icons8_charity, false),
    RICHIE_PROJECTS("Richie Projects", "", R.drawable.ic_icons8_science_fiction, true),
    UNKNOWN("To be determined", "", R.drawable.ic_help_outline_black_24dp, true),
    WORK_TRIPS("Work Expenses", "Expenses and trips that are reimbursed by our jobs", R.drawable.ic_work_black_24dp, true),
    GAS("Gas", "", R.drawable.ic_local_gas_station_black_24dp, false),
    INCOME("Income", "", R.drawable.ic_attach_money_black_24dp, false),
    TRANSFER("Transfer", "Pay Credit Card, Invest Money", R.drawable.ic_compare_arrows_black_24dp, false),
    MORTGAGE("Mortgage", "", R.drawable.ic_icons8_real_estate, false),
    STUDENT_LOAN("Student Loan", "", R.drawable.ic_icons8_graduation_cap, false),
    SUBSCRIPTIONS("Subscriptions", "Insurance, Netflix, Amazon, Gym", R.drawable.ic_icons8_play_button_on_tv, false),
    UTILITIES("Utilities", "Internet, Phones, Electric, Water, Trash", R.drawable.ic_icons8_water_pipe, false);

    companion object {
        fun lookupOrUnknown(title: String): Budget {
            return lookup(title) ?: UNKNOWN
        }

        fun lookup(title: String): Budget? {
            return values().find { it.title == title }
        }
    }
}





















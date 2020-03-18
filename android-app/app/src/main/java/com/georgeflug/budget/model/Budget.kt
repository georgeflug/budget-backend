package com.georgeflug.budget.model

import android.support.annotation.DrawableRes
import com.georgeflug.budget.R
import java.math.BigDecimal

enum class Budget(
        val title: String,
        val description: String,
        @DrawableRes val iconId: Int,
        val isAutomatic: Boolean,
        val askForDescription: Boolean) {
    RICHIE("Richie", "", R.drawable.ic_icons8_user_male, false, true),
    STEF("Stef", "", R.drawable.ic_icons8_female_user, false, true),
    BEN("Ben", "", R.drawable.ic_icons8_babys_room, false, true),
    CLOTHES("Clothes", "Clothes, hair, makeup", R.drawable.ic_icons8_tshirt, false, true),
    GROCERIES("Groceries", "", R.drawable.ic_icons8_bread, false, false),
    ENTERTAINMENT("Entertainment", "Restaurants, bars, food, movies, outings, etc", R.drawable.ic_icons8_beer, false, true),
    HOME_SUPPLIES("Home Supplies", "", R.drawable.ic_icons8_house, false, true),
    GIFTS("Gifts", "", R.drawable.ic_icons8_gift, false, true),
    BIG_NECESSITIES("Big Necessities", "Health bills, car repairs, house repairs", R.drawable.ic_healing_black_24dp, false, true),
    OPTIONAL_IMPORTANT("Optional Important", "Gifts, optional house improvements, Christmas cards & gifts, photo books", R.drawable.ic_icons8_approve, false, true),
    TRAVEL("Travel", "", R.drawable.ic_icons8_airplane_mode_on, false, true),
    CHRISTMAS("Christmas", "", R.drawable.ic_icons8_christmas_tree, false, true),
    CHARITY("Charity", "", R.drawable.ic_icons8_charity, false, false),
    RICHIE_PROJECTS("Richie Projects", "", R.drawable.ic_icons8_science_fiction, false, true),
    UNKNOWN("To be determined", "", R.drawable.ic_help_outline_black_24dp, false, true),
    WORK_TRIPS("Work Expenses", "Expenses and trips that are reimbursed by our jobs", R.drawable.ic_work_black_24dp, false, true),
    GAS("Gas", "", R.drawable.ic_local_gas_station_black_24dp, false, false),
    INCOME("Income", "", R.drawable.ic_attach_money_black_24dp, false, false),
    TRANSFER("Transfer", "Pay Credit Card, Invest Money", R.drawable.ic_compare_arrows_black_24dp, false, false),
    MORTGAGE("Mortgage", "", R.drawable.ic_icons8_real_estate, false, false),
    STUDENT_LOAN("Student Loan", "", R.drawable.ic_icons8_graduation_cap, false, false),
    SUBSCRIPTIONS("Subscriptions", "Insurance, Netflix, Amazon, Gym", R.drawable.ic_icons8_play_button_on_tv, false, false),
    UTILITIES("Utilities", "Internet, Phones, Electric, Water, Trash", R.drawable.ic_icons8_water_pipe, false, false);

    companion object {
        fun lookupOrUnknown(title: String): Budget {
            return lookup(title) ?: UNKNOWN
        }

        fun lookup(title: String): Budget? {
            return values().find { it.title == title }
        }
    }
}





















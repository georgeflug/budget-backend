package com.georgeflug.budget.budgets

import android.support.annotation.DrawableRes
import com.georgeflug.budget.R
import java.math.BigDecimal

enum class Budget(
        val title: String,
        val description: String,
        val amount: BigDecimal?,
        @DrawableRes val iconId: Int,
        val isAutomatic: Boolean)
{
    RICHIE("Richie", "", BigDecimal(120), R.drawable.ic_icons8_user_male, false),
    STEF("Stef", "", BigDecimal(120), R.drawable.ic_icons8_female_user, false),
    BEN("Ben", "",null, R.drawable.ic_icons8_babys_room, false),
    CLOTHES("Clothes", "Clothes, hair, makeup", BigDecimal(70), R.drawable.ic_icons8_tshirt, false),
    GROCERIES("Groceries", "", BigDecimal(400), R.drawable.ic_icons8_bread, false),
    ENTERTAINMENT("Entertainment", "Restaurants, bars, food, movies, outings, etc", BigDecimal(150), R.drawable.ic_icons8_beer, false),
    HOME_SUPPLIES("Home Supplies", "", null, R.drawable.ic_icons8_house, false),
    GIFTS("Gifts", "", null, R.drawable.ic_icons8_gift, false),
    BIG_NECESSITIES("Big Necessities", "Health bills, car repairs, house repairs", null, R.drawable.ic_healing_black_24dp, false),
    OPTIONAL_IMPORTANT("Optional Important", "Gifts, optional house improvements, Christmas cards & gifts, photo books", null, R.drawable.ic_icons8_approve, false),
    TRAVEL("Travel", "", null, R.drawable.ic_icons8_airplane_mode_on, false),
    CHRISTMAS("Christmas", "", null, R.drawable.ic_icons8_christmas_tree, false),
    CHARITY("Charity", "", null, R.drawable.ic_icons8_charity, false),
    RICHIE_PROJECTS("Richie Projects", "", null, R.drawable.ic_icons8_science_fiction, false),
    UNKNOWN("To be determined", "", null, R.drawable.ic_icons8_play_button_on_tv, false),
    MORTGAGE("Mortgage", "", null, R.drawable.ic_icons8_real_estate, false),
    STUDENT_LOAN("Student Loan", "", null, R.drawable.ic_icons8_graduation_cap, true),
    SUBSCRIPTIONS("Subscriptions", "Insurance, Netflix, Amazon, Gym", null, R.drawable.ic_icons8_play_button_on_tv, true),
    UTILITIES("Utilities", "Internet, Phones, Electric, Water, Trash", null, R.drawable.ic_icons8_water_pipe, true);

    fun hasAmount() = amount != BigDecimal.ZERO

    companion object {
        fun lookup(title: String): Budget? {
            return Budget.values().find { it.title == title }
        }
    }
}





















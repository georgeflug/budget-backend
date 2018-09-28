package com.georgeflug.budget.budgets

import android.support.annotation.DrawableRes
import com.georgeflug.budget.R
import java.math.BigDecimal

enum class Budget(val title: String, val description: String, val amount: BigDecimal?, @DrawableRes val iconId: Int) {
    RICHIE("Richie", "", BigDecimal(120), R.drawable.ic_icons8_user_male),
    STEF("Stef", "", BigDecimal(120), R.drawable.ic_icons8_female_user),
    BEN("Ben", "",null, R.drawable.ic_icons8_babys_room),
    BIG_NECESSITIES("Big Necessities", "Health bills, car repairs, house repairs", null, R.drawable.ic_healing_black_24dp),
    CHARITY("Charity", "", null, R.drawable.ic_icons8_charity),
    CLOTHES("Clothes", "Clothes, hair, makeup", BigDecimal(70), R.drawable.ic_icons8_tshirt),
    ENTERTAINMENT("Entertainment", "Restaurants, bars, food, movies, outings, etc", BigDecimal(150), R.drawable.ic_icons8_beer),
    GROCERIES("Groceries", "", BigDecimal(400), R.drawable.ic_icons8_bread),
    MORTGAGE("Mortgage", "", null, R.drawable.ic_icons8_real_estate),
    OPTIONAL_IMPORTANT("Optional Important", "Gifts, optional house improvements, Christmas cards & gifts, photo books", null, R.drawable.ic_icons8_approve),
    GIFTS("Gifts", "", null, R.drawable.ic_icons8_gift),
    CHRISTMAS("Christmas", "", null, R.drawable.ic_icons8_christmas_tree),
    RICHIE_PROJECTS("Richie Projects", "", null, R.drawable.ic_icons8_science_fiction),
    STUDENT_LOAN("Student Loan", "", null, R.drawable.ic_icons8_graduation_cap),
    SUBSCRIPTIONS("Subscriptions", "Insurance, Netflix, Amazon, Gym", null, R.drawable.ic_icons8_play_button_on_tv),
    HOME_SUPPLIES("Home Supplies", "", null, R.drawable.ic_icons8_house),
    TRAVEL("Travel", "", null, R.drawable.ic_icons8_airplane_mode_on),
    UTILITIES("Utilities", "Internet, Phones, Electric, Water, Trash", null, R.drawable.ic_icons8_water_pipe);

    fun hasAmount() = amount != BigDecimal.ZERO

    companion object {
        fun lookup(title: String): Budget? {
            return Budget.values().find { it.title == title }
        }
    }
}





















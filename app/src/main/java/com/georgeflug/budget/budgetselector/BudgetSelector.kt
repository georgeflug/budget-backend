package com.georgeflug.budget.budgetselector

import android.content.Context
import android.support.v4.content.ContextCompat
import android.support.v4.content.res.ResourcesCompat
import android.util.AttributeSet
import android.util.TypedValue
import android.view.Gravity
import android.widget.CheckBox
import com.georgeflug.budget.R
import com.georgeflug.budget.budgets.Budget
import com.google.android.flexbox.FlexWrap
import com.google.android.flexbox.FlexboxLayout
import com.google.android.flexbox.JustifyContent

class BudgetSelector : FlexboxLayout {
    constructor(context: Context): super(context)
    constructor(context: Context, attributeSet: AttributeSet): super(context, attributeSet)

    var selectedRadio : CheckBox? = null
        set(newValue) {
            field?.isChecked = false
            field = newValue
            field?.isChecked = true
        }
    var selectedBudget : Budget? = null

    init {
        flexWrap = FlexWrap.WRAP
        justifyContent = JustifyContent.SPACE_AROUND

        val textPixels = TypedValue.applyDimension(TypedValue.COMPLEX_UNIT_SP, 6f, context.resources.displayMetrics)
        val widthPixels = TypedValue.applyDimension(TypedValue.COMPLEX_UNIT_DIP, 112f, context.resources.displayMetrics).toInt()
        val heightPixels = TypedValue.applyDimension(TypedValue.COMPLEX_UNIT_DIP, 96f, context.resources.displayMetrics).toInt()
        val paddingPixelsX = TypedValue.applyDimension(TypedValue.COMPLEX_UNIT_DIP, 8f, context.resources.displayMetrics).toInt()
        val paddingPixelsY = TypedValue.applyDimension(TypedValue.COMPLEX_UNIT_DIP, 24f, context.resources.displayMetrics).toInt()
        val paddingPixelsYTwoLines = TypedValue.applyDimension(TypedValue.COMPLEX_UNIT_DIP, 16f, context.resources.displayMetrics).toInt()

        Budget.values()
                .filter { budget -> !budget.isAutomatic }
                .forEach { budget ->
            val icon = ContextCompat.getDrawable(context, budget.iconId)
            addView(CheckBox(context, null, 0).apply {
                text = budget.title
                setCompoundDrawablesWithIntrinsicBounds(null, icon, null, null)
                textSize = textPixels
                width = widthPixels
                height = heightPixels
                gravity = Gravity.CENTER
                val backgroundDrawable = ResourcesCompat.getDrawable(resources, R.drawable.budget_radio_selector, null)
                background = backgroundDrawable
                if (budget.title.contains(" ")) {
                    setPadding(paddingPixelsX, paddingPixelsYTwoLines, paddingPixelsX, paddingPixelsYTwoLines)
                } else {
                    setPadding(paddingPixelsX, paddingPixelsY, paddingPixelsX, paddingPixelsY)
                }
                setOnClickListener {
                    selectedRadio = this
                    selectedBudget = budget
                }
            })
        }
    }
}
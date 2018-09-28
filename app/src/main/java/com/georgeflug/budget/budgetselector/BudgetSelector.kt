package com.georgeflug.budget.budgetselector

import android.content.Context
import android.support.v4.content.ContextCompat
import android.util.AttributeSet
import android.util.TypedValue
import android.view.Gravity
import android.widget.RadioButton
import com.georgeflug.budget.budgets.Budget
import com.google.android.flexbox.FlexWrap
import com.google.android.flexbox.FlexboxLayout
import com.google.android.flexbox.JustifyContent

class BudgetSelector : FlexboxLayout {
    constructor(context: Context): super(context)
    constructor(context: Context, attributeSet: AttributeSet): super(context, attributeSet)

    init {
        flexWrap = FlexWrap.WRAP
        justifyContent = JustifyContent.SPACE_AROUND

        val textPixels = TypedValue.applyDimension(TypedValue.COMPLEX_UNIT_SP, 6f, context.resources.displayMetrics)
        val widthPixels = TypedValue.applyDimension(TypedValue.COMPLEX_UNIT_DIP, 96f, context.resources.displayMetrics).toInt()
        val paddingPixels = TypedValue.applyDimension(TypedValue.COMPLEX_UNIT_DIP, 8f, context.resources.displayMetrics).toInt()

        Budget.values().forEach { budget ->
            val icon = ContextCompat.getDrawable(context, budget.iconId)
            addView(RadioButton(context, null, 0).apply {
                text = budget.title
                setCompoundDrawablesWithIntrinsicBounds(null, icon, null, null)
                textSize = textPixels
                width = widthPixels
                gravity = Gravity.CENTER
                setPadding(paddingPixels, paddingPixels, paddingPixels, paddingPixels)
            })
        }
    }
}
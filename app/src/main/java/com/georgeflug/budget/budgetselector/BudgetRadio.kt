package com.georgeflug.budget.budgetselector

import android.content.Context
import android.util.AttributeSet
import android.view.LayoutInflater
import android.widget.RadioButton
import com.georgeflug.budget.R

class BudgetRadio : RadioButton {
    constructor(context: Context): super(context)
    constructor(context: Context, attributeSet: AttributeSet): super(context, attributeSet)

    init {
//        val inflator = context.getSystemService(Context.LAYOUT_INFLATER_SERVICE) as LayoutInflater
//        inflator.inflate(R.layout.budget_radio, this, true)
    }
}
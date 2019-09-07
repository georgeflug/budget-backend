package com.georgeflug.budget.view.budget

import android.content.Context
import android.graphics.Color
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.BaseAdapter
import android.widget.ImageView
import android.widget.TextView
import com.georgeflug.budget.R
import com.georgeflug.budget.view.budget.rollupmodel.MonthCategoryRollup
import java.math.BigDecimal
import java.text.NumberFormat

class BudgetAdapter(val context: Context) : BaseAdapter() {
    val currencyFormatter = NumberFormat.getCurrencyInstance().apply {
        maximumFractionDigits = 0
    }

    var data: List<MonthCategoryRollup> = listOf()
        set(value) {
            field = sortBudgets(value)
            notifyDataSetChanged()
        }

    override fun getView(position: Int, convertView: View?, parent: ViewGroup?): View {
        val view = convertView
                ?: LayoutInflater.from(context).inflate(R.layout.budget_item, parent, false)

        val budget = data[position]
        view.findViewById<ImageView>(R.id.budgetImage).setImageResource(budget.iconId)
        view.findViewById<TextView>(R.id.budgetNameText).text = budget.title
        view.findViewById<TextView>(R.id.remainingBudgetText).text = getRemainingToSpendText(budget)
        view.findViewById<TextView>(R.id.remainingBudgetText).setTextColor(getRemainingToSpendColor(budget))
        view.findViewById<TextView>(R.id.budgetAllocationText).text = getAllocatedText(budget)
        view.findViewById<TextView>(R.id.budgetTotalText).text = getTotalAmountText(budget)

        return view
    }

    override fun getItem(position: Int): Any {
        return data[position]
    }

    override fun getItemId(position: Int): Long {
        return position.toLong()
    }

    override fun getCount(): Int {
        return data.size
    }

    private fun sortBudgets(budgets: List<MonthCategoryRollup>): List<MonthCategoryRollup> {
        return budgets.sortedBy {
            val prefix = if (it.perMonth == BigDecimal.ZERO) "1" else "0"
            prefix + it.title
        }
    }

    private fun getTotalAmountText(budget: MonthCategoryRollup): String {
        return if (budget.total >= BigDecimal.ZERO) {
            currencyFormatter.format(budget.total)
        } else {
            "+" + currencyFormatter.format(-budget.total)
        }
    }

    private fun getRemainingToSpendText(budget: MonthCategoryRollup): CharSequence {
        if (budget.perMonth == BigDecimal.ZERO) {
            return ""
        }

        if (budget.remainingToSpend < BigDecimal.ZERO) {
            val formattedAmount = currencyFormatter.format(-budget.remainingToSpend)
            return "$formattedAmount over budget"
        }
        val formattedAmount = currencyFormatter.format(budget.remainingToSpend)
        return "$formattedAmount remaining"
    }

    private fun getRemainingToSpendColor(budget: MonthCategoryRollup): Int {
        return if (budget.remainingToSpend < BigDecimal.ZERO) Color.RED else Color.GREEN
    }

    private fun getAllocatedText(budget: MonthCategoryRollup): String {
        val formattedAmount = currencyFormatter.format(budget.perMonth)
        return if (budget.perMonth == BigDecimal.ZERO) "" else "($formattedAmount per month)"
    }
}
package com.georgeflug.budget.view.transaction.list

import com.georgeflug.budget.model.Budget

class TransactionsDynamicallyFilterableModel : TransactionsModel {
    var model = TransactionsFilteredModel()
    private var listener: (() -> Unit)? = null

    var filterMonth: Int? = null
        set(value) {
            field = value
            onNewModel()
        }
    var filterBudget: Budget? = null
        set(value) {
            field = value
            onNewModel()
        }

    init {
        onNewModel()
    }

    override val items: ArrayList<SectionOrTransaction>
        get() = model.items

    override val size: Int
        get() = model.size

    override fun getSectionOrTransactionAt(position: Int): SectionOrTransaction {
        return model.getSectionOrTransactionAt(position)
    }

    override fun setOnChangeListener(onChange: () -> Unit) {
        listener = onChange
    }

    private fun onChange() {
        listener?.invoke()
    }

    private fun onNewModel() {
        model = TransactionsFilteredModel(filterMonth, filterBudget)
        model.setOnChangeListener(::onChange)
        onChange()
    }
}

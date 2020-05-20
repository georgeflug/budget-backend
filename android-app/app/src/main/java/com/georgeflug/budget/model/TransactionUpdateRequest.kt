package com.georgeflug.budget.model

data class TransactionUpdateRequest(
        val version: Int,
        val splits: List<TransactionSplit>
)

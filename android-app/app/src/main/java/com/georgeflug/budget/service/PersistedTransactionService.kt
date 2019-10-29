package com.georgeflug.budget.service

import android.annotation.SuppressLint
import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.module.kotlin.registerKotlinModule
import com.georgeflug.budget.model.Transaction
import timber.log.Timber

object PersistedTransactionService {
    private const val FILENAME = "transactions.dat"

    private val mapper = ObjectMapper().registerKotlinModule()
    private val transactions: MutableList<Transaction> = mutableListOf()

    init {
        listenForTransactions()
    }

    @SuppressLint("CheckResult")
    private fun listenForTransactions() {
        TransactionService.getInitialTransactions()
                .subscribe(::saveInitialTransactions, ::handleError)
        TransactionService.listenForNewTransactions()
                .subscribe(::saveTransaction, ::handleError)
    }

    fun getPersistedTransactions(): List<Transaction> {
        val json = FileService.readFromFile(FILENAME)
        return if (json == null) {
            listOf()
        } else {
            try {
                mapper.readValue(json, Array<Transaction>::class.java).toList()
            } catch (ex: Exception) {
                Timber.e(ex, "Could not read transactions from disk")
                listOf<Transaction>()
            }
        }
    }

    fun getLatestTimestamp(transactions: List<Transaction>): String? = transactions.map { it.updatedAt }.max()

    fun clearCache() {
        FileService.clearFile(FILENAME)
    }

    private fun saveInitialTransactions(transactions: List<Transaction>) {
        this.transactions.clear()
        this.transactions.addAll(transactions)
        persistTransactions()
    }

    private fun saveTransaction(transaction: Transaction) {
        val existingLocation = transactions.indexOfFirst { it._id == transaction._id }
        if (existingLocation != -1) {
            transactions[existingLocation] = transaction
        } else {
            transactions.add(transaction)
        }
        persistTransactions()
    }

    private fun persistTransactions() {
        val json = mapper.writeValueAsString(transactions)
        FileService.writeToFile(FILENAME, json)
    }

    private fun handleError(throwable: Throwable) {
        Timber.e(throwable, "Could not save transactions to disk")
    }

}

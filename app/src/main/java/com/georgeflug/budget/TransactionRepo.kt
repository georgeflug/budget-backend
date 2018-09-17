package com.georgeflug.budget

import io.reactivex.Observable
import io.reactivex.android.schedulers.AndroidSchedulers
import io.reactivex.schedulers.Schedulers
import java.net.URL

object TransactionRepo {
    private val request = URL("https://script.google.com/macros/s/AKfycbzJXrwFepauVmiodXfe81zETyqgAMcwdjR8fRjJ1NvrcpAgPPg/exec")

    fun getTransactions() = Observable.fromCallable { request.openStream().bufferedReader().use { it.readText() } }
                .subscribeOn(Schedulers.io())
                .observeOn(AndroidSchedulers.mainThread())
                .cache()
}
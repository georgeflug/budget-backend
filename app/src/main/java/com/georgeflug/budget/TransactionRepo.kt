package com.georgeflug.budget

import io.reactivex.Observable
import io.reactivex.android.schedulers.AndroidSchedulers
import io.reactivex.schedulers.Schedulers
import java.net.URL

object TransactionRepo {
    private const val url = "https://script.google.com/macros/s/AKfycbzJXrwFepauVmiodXfe81zETyqgAMcwdjR8fRjJ1NvrcpAgPPg/exec"

    fun getTransactions(): Observable<String> = getRequest(url).cache()

    fun addTransaction(date: String, amount: String, budget: String, description: String): Observable<String> =
            getRequest("$url?Date=$date&Amount=$amount&Budget=$budget&Description=$description")

    private fun getRequest(requestUrl: String): Observable<String> =
            Observable.fromCallable { URL(requestUrl).openStream().bufferedReader().use { it.readText() } }
                    .subscribeOn(Schedulers.io())
                    .observeOn(AndroidSchedulers.mainThread())
}
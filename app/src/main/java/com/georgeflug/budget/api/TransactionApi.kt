package com.georgeflug.budget.api

import com.google.gson.Gson
import io.reactivex.Observable
import io.reactivex.android.schedulers.AndroidSchedulers
import io.reactivex.schedulers.Schedulers
import java.net.URL

object TransactionApi {
    private const val url = "https://script.google.com/macros/s/AKfycbzn7I-KiMGF5N2V8xJXLJTSn1Zzh4da4G-Jjp-7RfM/dev"

    fun getTransactions(): Observable<TransactionApiListResult> =
            getRequest("$url?route=getTransactions").cache()
            .map { Gson().fromJson(it, TransactionApiListResult::class.java) }

    fun addTransaction(date: String, amount: String, budget: String, description: String): Observable<String> =
            getRequest("$url?route=insertTransaction&date=$date&amount=$amount&budget=$budget&description=$description")

    fun updateTransaction(date: String?, amount: String, budget: String, description: String, row: Int): Observable<String> =
            getRequest("$url?route=updateTransaction&date=$date&amount=$amount&budget=$budget&description=$description&updateRow=$row")

    private fun getRequest(requestUrl: String): Observable<String> =
            Observable.fromCallable { URL(requestUrl).openStream().bufferedReader().use { it.readText() } }
                    .subscribeOn(Schedulers.io())
                    .observeOn(AndroidSchedulers.mainThread())
                    .doOnNext {
                        if (!it.contains(""""result":"success"""")) {
                            // hacky, parse strings or objects
                            val errorLocation = it.indexOf("error\":")
                            var error = it.drop(errorLocation + 7).dropLast(1)
                            if (error.startsWith("\"")) error = error.drop(1).dropLast(1)
                            throw ApiException(error)
                        }
                    }
}
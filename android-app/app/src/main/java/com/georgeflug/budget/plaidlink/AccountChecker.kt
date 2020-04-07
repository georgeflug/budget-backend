package com.georgeflug.budget.plaidlink

import android.app.Activity
import com.georgeflug.budget.api.BudgetApi
import com.plaid.link.Plaid
import com.plaid.linkbase.models.configuration.LinkConfiguration
import com.plaid.linkbase.models.configuration.PlaidProduct
import io.reactivex.android.schedulers.AndroidSchedulers

class AccountChecker {
    companion object {
        val checkAccountApi: CheckAccountApi = BudgetApi.retrofit.create(CheckAccountApi::class.java)
    }

    fun checkAccounts(activity: Activity) {
        checkAccountApi.checkAccountConnectivity()
                .observeOn(AndroidSchedulers.mainThread())
                .subscribe {
                    it.forEach { handleCheckAccountResult(activity, it) }
                }
    }

    private fun handleCheckAccountResult(activity: Activity, checkAccountResult: CheckAccountResult) {
        if (checkAccountResult.status == CheckAccountStatus.NeedsLogin) {
            reconnectAccount(activity, checkAccountResult.linkToken)
        }
    }

    private fun reconnectAccount(activity: Activity, publicToken: String) {
        Plaid.openLink(
                activity,
                LinkConfiguration(
                        clientName = "Budget App",
                        products = listOf(PlaidProduct.TRANSACTIONS),
                        publicToken = publicToken
                ),
                1
        );
    }
}

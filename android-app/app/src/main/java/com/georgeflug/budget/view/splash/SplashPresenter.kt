package com.georgeflug.budget.view.splash

import android.app.Activity
import com.georgeflug.budget.notification.NotificationService
import com.georgeflug.budget.plaidlink.AccountChecker
import com.georgeflug.budget.service.TransactionService
import io.reactivex.android.schedulers.AndroidSchedulers
import io.reactivex.disposables.Disposable

class SplashPresenter(val view: SplashContract.View) : SplashContract.Presenter {

    override fun load(activity: Activity) {
        NotificationService().registerApp(activity)
        AccountChecker().checkAccounts(activity)
        TransactionService.downloadTransactions()
        var subscription: Disposable? = null
        subscription = TransactionService.getInitialTransactions()
                .observeOn(AndroidSchedulers.mainThread())
                .subscribe {
                    view.showMainAppPage()
                    subscription!!.dispose()
                }

    }

}
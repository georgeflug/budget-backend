package com.georgeflug.budget.view.splash

import android.app.Activity
import com.georgeflug.budget.notification.NotificationService
import com.georgeflug.budget.plaidlink.AccountChecker
import com.georgeflug.budget.service.TransactionService
import io.reactivex.Completable
import io.reactivex.android.schedulers.AndroidSchedulers
import io.reactivex.disposables.CompositeDisposable


class SplashPresenter(val view: SplashContract.View) : SplashContract.Presenter {
    private val compositeDisposable = CompositeDisposable()

    private var notificationState: Boolean = false
    private var accountCheckerState: Boolean = false
    private var downloadTransactionState: Boolean = false

    override fun load(activity: Activity) {
        compositeDisposable.add(
                Completable.mergeArrayDelayError(
                        registerNotifications(activity),
                        verifyAccountConnectivity(activity),
                        loadTransactions()
                )
                        .observeOn(AndroidSchedulers.mainThread())
                        .subscribe { view.showMainAppPage() }
        )
    }

    private fun registerNotifications(activity: Activity): Completable {
        return NotificationService().registerApp(activity)
                .observeOn(AndroidSchedulers.mainThread())
                .doOnComplete {
                    notificationState = true
                    updateStatus()
                }
    }

    private fun verifyAccountConnectivity(activity: Activity): Completable {
        return AccountChecker().checkAccounts(activity)
                .observeOn(AndroidSchedulers.mainThread())
                .doOnComplete {
                    accountCheckerState = true
                    updateStatus()
                }
    }

    private fun loadTransactions(): Completable {
        return TransactionService.downloadTransactionsObservable()
                .ignoreElement()
                .observeOn(AndroidSchedulers.mainThread())
                .doOnComplete {
                    downloadTransactionState = true
                    updateStatus()
                }
    }

    override fun unload() {
        compositeDisposable.dispose()
    }

    private fun updateStatus() {
        val status: String = """
            Registering for notifications...${if (notificationState) "Done!" else ""}
            Checking account connectivity...${if (accountCheckerState) "Done!" else ""}
            Loading transactions...${if (downloadTransactionState) "Done!" else ""}
        """.trimIndent()
        view.displayStatus(status)
    }
}

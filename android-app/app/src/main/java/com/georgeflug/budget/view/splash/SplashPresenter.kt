package com.georgeflug.budget.view.splash

import android.app.Activity
import com.georgeflug.budget.notification.NotificationService
import com.georgeflug.budget.plaidlink.AccountChecker
import com.georgeflug.budget.transactions.TransactionService
import io.reactivex.Completable
import io.reactivex.android.schedulers.AndroidSchedulers
import io.reactivex.disposables.CompositeDisposable
import timber.log.Timber


class SplashPresenter(val view: SplashContract.View) : SplashContract.Presenter {
    private val compositeDisposable = CompositeDisposable()

    private var notificationState: String = ""
    private var accountCheckerState: String = ""
    private var downloadTransactionState: String = ""

    override fun load(activity: Activity) {
        updateStatus()
        compositeDisposable.add(
                Completable.mergeArrayDelayError(
                        registerNotifications(activity),
                        verifyAccountConnectivity(activity),
                        loadTransactions()
                )
                        .observeOn(AndroidSchedulers.mainThread())
                        .subscribe({
                            view.showMainAppPage()
                        }, {
                            Timber.e(it, "Failed to initialize app");
                            view.displayLogButton()
                        })
        )
    }

    private fun registerNotifications(activity: Activity): Completable {
        return NotificationService().registerApp(activity)
                .doOnError {
                    Timber.e(it, "Failed to register notifications")
                    notificationState = "Failed!"
                }
                .doOnSuccess { notificationState = "Done!" }
                .observeOn(AndroidSchedulers.mainThread())
                .doFinally { updateStatus() }
                .ignoreElement()
    }

    private fun verifyAccountConnectivity(activity: Activity): Completable {
        return AccountChecker().checkAccounts(activity)
                .doOnError {
                    Timber.e(it, "Failed to check account connectivity")
                    accountCheckerState = "Failed!"
                }.doOnSuccess { accountCheckerState = "Done!" }
                .observeOn(AndroidSchedulers.mainThread())
                .doFinally { updateStatus() }
                .ignoreElement()
    }

    private fun loadTransactions(): Completable {
        return TransactionService.INSTANCE.initialize()
                .doOnError {
                    Timber.e(it, "Failed to load transactions")
                    downloadTransactionState = "Failed!"
                }.doOnComplete { downloadTransactionState = "Done!" }
                .observeOn(AndroidSchedulers.mainThread())
                .doFinally { updateStatus() }
    }

    override fun unload() {
        compositeDisposable.dispose()
    }

    private fun updateStatus() {
        val status: String = """
            Registering for notifications...$notificationState
            Checking account connectivity...$accountCheckerState
            Loading transactions...$downloadTransactionState
        """.trimIndent()
        view.displayStatus(status)
    }
}

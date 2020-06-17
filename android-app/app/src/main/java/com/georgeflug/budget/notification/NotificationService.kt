package com.georgeflug.budget.notification

import android.content.Context
import android.provider.Settings
import com.georgeflug.budget.api.BudgetApi
import com.georgeflug.budget.model.BackendStatus
import com.georgeflug.budget.model.NotificationRegistrationInfo
import com.google.android.gms.tasks.OnCompleteListener
import com.google.firebase.iid.FirebaseInstanceId
import io.reactivex.Single
import timber.log.Timber


class NotificationService {
    fun registerApp(context: Context): Single<BackendStatus> {
        return getFirebaseToken()
                .flatMap { token -> registerAppNow(context, token) }
    }

    private fun getFirebaseToken(): Single<String> {
        return Single.create { subscriber ->
            FirebaseInstanceId.getInstance().instanceId
                    .addOnCompleteListener(OnCompleteListener { task ->
                        if (task.isSuccessful) {
                            val token = task.result?.token
                            if (token != null) {
                                subscriber.onSuccess(token)
                                return@OnCompleteListener
                            }
                        }
                        subscriber.onError(task.exception
                                ?: RuntimeException("Could not get Firebase token"))
                    })
        }
    }

    private fun registerAppNow(context: Context, token: String): Single<BackendStatus> {
        val registrationInfo = NotificationRegistrationInfo(
                registrationToken = token,
                owner = getOwner(context)
        )
        return BudgetApi.notificationApi.registerApp(registrationInfo)
                .doAfterSuccess { Timber.d("Successfully registered app with the backend for notifications") }
                .doOnError { Timber.e("Failed to register notifications to backend", it) }
    }

    fun getOwner(context: Context): String {
        val androidId = Settings.Secure.getString(context.contentResolver, Settings.Secure.ANDROID_ID)
        if (androidId == "91bad5233c51f707") {
            return "Richie"
        } else {
            return "Stef"
        }
    }
}
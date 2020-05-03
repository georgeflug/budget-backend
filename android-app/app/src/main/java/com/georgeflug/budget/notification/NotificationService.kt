package com.georgeflug.budget.notification

import android.content.Context
import android.provider.Settings
import com.georgeflug.budget.api.BudgetApi
import com.georgeflug.budget.model.NotificationRegistrationInfo
import com.google.android.gms.tasks.OnCompleteListener
import com.google.firebase.iid.FirebaseInstanceId
import timber.log.Timber


class NotificationService {
    fun registerApp(context: Context) {
        FirebaseInstanceId.getInstance().instanceId
                .addOnCompleteListener(OnCompleteListener { task ->
                    if (task.isSuccessful) {
                        val token = task.result?.token
                        if (token != null) registerAppNow(context, token)
                    }
                })
    }

    fun registerAppNow(context: Context, token: String) {
        val registrationInfo = NotificationRegistrationInfo(
                registrationToken = token,
                owner = getOwner(context)
        )
        BudgetApi.notificationApi.registerApp(registrationInfo)
                .subscribe({
                    Timber.d("Successfully registered app with the backend for notifications")
                }, {
                    Timber.e("Failed to register notifications to backend", it)
                })
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
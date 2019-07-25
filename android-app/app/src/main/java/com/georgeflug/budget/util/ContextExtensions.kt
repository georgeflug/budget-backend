package com.georgeflug.budget.util

import android.app.NotificationManager
import android.content.Context

fun Context.getNotificationManager() = getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager

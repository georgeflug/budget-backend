package com.georgeflug.budget.dailyreminder

import android.content.Context
import android.support.v4.app.NotificationCompat
import androidx.work.Worker
import androidx.work.WorkerParameters
import com.georgeflug.budget.util.getNotificationManager
import com.georgeflug.budget.R
import java.time.LocalTime

class DailyReminderWorker(appContext: Context, workerParams: WorkerParameters)
    : Worker(appContext, workerParams) {

    override fun doWork(): Result {
        // download latest data
        // count new transactions
        // count unlabelled transactions
        // send notification
        val notification = NotificationCompat.Builder(applicationContext, DailyReminderNotificationChannelInitializer.CHANNEL_ID)
                .setContentTitle("Title")
                .setContentText("Body")
                .setPriority(NotificationCompat.PRIORITY_DEFAULT)
                .setSmallIcon(R.drawable.ic_icons8_beer)
                .build()

        applicationContext.getNotificationManager().notify(1, notification)

        DailyReminderScheduler().scheduleReminder(LocalTime.now().plusSeconds(10))
        return Result.success()
    }

}
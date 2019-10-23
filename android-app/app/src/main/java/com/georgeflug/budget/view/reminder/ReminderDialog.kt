package com.georgeflug.budget.view.reminder

import android.app.Dialog
import android.content.Context
import android.os.Bundle
import android.view.Window
import android.view.WindowManager
import com.georgeflug.budget.R
import com.georgeflug.budget.dailyreminder.DailyReminderScheduler
import com.georgeflug.budget.dailyreminder.DailyReminderSettings
import kotlinx.android.synthetic.main.dialog_reminder.*
import java.time.LocalTime

class ReminderDialog(context: Context) : Dialog(context) {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        requestWindowFeature(Window.FEATURE_NO_TITLE)
        setContentView(R.layout.dialog_reminder)
        window.setLayout(WindowManager.LayoutParams.MATCH_PARENT, WindowManager.LayoutParams.WRAP_CONTENT)

        reminderCheckBox.setOnCheckedChangeListener { _, isChecked -> reminderTimePicker.isEnabled = isChecked }
        reminderCancelButton.setOnClickListener { dismiss() }
        reminderSubmitButton.setOnClickListener {
            dismiss()
            saveValues()
            setUpNextReminder()
        }

        loadInitialValues()
    }

    private fun loadInitialValues() {
        val settings = DailyReminderSettings(context)
        reminderCheckBox.isChecked = settings.enabled
        reminderTimePicker.hour = settings.timeOfDay.hour
        reminderTimePicker.minute = settings.timeOfDay.minute
    }

    private fun saveValues() {
        val settings = DailyReminderSettings(context)
        settings.enabled = reminderCheckBox.isChecked
        settings.timeOfDay = getSelectedTime()
    }

    private fun setUpNextReminder() {
        if (reminderCheckBox.isChecked) {
            DailyReminderScheduler().scheduleReminder(context, getSelectedTime())
        } else {
            DailyReminderScheduler().cancelReminder(context)
        }
    }

    private fun getSelectedTime() = LocalTime.of(reminderTimePicker.hour, reminderTimePicker.minute, 0)
}
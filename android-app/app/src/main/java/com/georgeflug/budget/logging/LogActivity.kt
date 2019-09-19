package com.georgeflug.budget.logging

import android.content.Context
import android.content.Intent
import android.os.Bundle
import android.support.v7.app.AppCompatActivity
import com.georgeflug.budget.R
import kotlinx.android.synthetic.main.dialog_logs.*

class LogActivity() : AppCompatActivity() {

    companion object {
        fun getIntent(context: Context) = Intent(context, LogActivity::class.java)
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.dialog_logs)

        logTextView.text = PersistedLogService.getLogs()
        clearLogButton.setOnClickListener {
            PersistedLogService.clearLog()
        }
        closeButton.setOnClickListener {
            finish()
        }
    }
}
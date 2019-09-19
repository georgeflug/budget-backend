package com.georgeflug.budget.logging

import android.util.Log.ASSERT
import android.util.Log.DEBUG
import android.util.Log.ERROR
import android.util.Log.INFO
import android.util.Log.VERBOSE
import android.util.Log.WARN
import timber.log.Timber
import java.io.PrintWriter
import java.io.StringWriter
import java.text.SimpleDateFormat
import java.time.LocalDate
import java.util.Locale

class LogToFileTree : Timber.Tree() {
    private val dateFormat = SimpleDateFormat("yyyy-MM-dd HH:mm:ss", Locale.US)

    override fun log(priority: Int, tag: String?, message: String, t: Throwable?) {
        val logMessage = "${getTimestamp()} ${getLogLevel(priority)} $tag: $message ${t?.let { getStackTrace(t) }}"
        PersistedLogService.writeToLog(logMessage);
    }

    private fun getTimestamp(): String? {
        return dateFormat.format(LocalDate.now())
    }

    private fun getLogLevel(priority: Int) = when (priority) {
        ASSERT -> "ASSERT"
        DEBUG -> "DEBUG"
        ERROR -> "ERROR"
        INFO -> "INFO"
        VERBOSE -> "VERBOSE"
        WARN -> "WARN"
        else -> "UNKNOWN"
    }

    private fun getStackTrace(t: Throwable): String {
        val sw = StringWriter()
        val pw = PrintWriter(sw)
        t.printStackTrace(pw)
        return sw.toString()
    }
}
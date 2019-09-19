package com.georgeflug.budget.util

import android.app.AlertDialog
import android.app.ProgressDialog
import android.content.Context
import android.widget.Toast
import timber.log.Timber

class AlertUtil {

    companion object {
        fun showProgress(context: Context, title: String, message: String): ProgressDialog {
            val dialog = ProgressDialog(context)
            dialog.setMessage(title)
            dialog.setTitle(message)
            dialog.isIndeterminate = false
            dialog.setCancelable(true)
            dialog.show()
            return dialog
        }

        fun showAlert(context: Context, title: String, message: String) {
            AlertDialog.Builder(context).setTitle(title).setMessage(message).create().show()
        }

        fun showError(context: Context, error: Throwable, message: String) {
            Timber.d(error, message)
            Toast.makeText(context, "$message: $error", Toast.LENGTH_LONG).show()
        }
    }
}
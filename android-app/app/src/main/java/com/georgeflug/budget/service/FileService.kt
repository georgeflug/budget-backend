package com.georgeflug.budget.service

import android.content.Context.MODE_APPEND
import android.content.Context.MODE_PRIVATE
import android.util.Log
import com.georgeflug.budget.BudgetApplication
import timber.log.Timber
import java.io.BufferedReader
import java.io.FileNotFoundException
import java.io.IOException
import java.io.InputStreamReader
import java.io.OutputStreamWriter
import java.util.stream.Collectors


object FileService {
    fun writeToFile(fileName: String, data: String) {
        try {
            OutputStreamWriter(BudgetApplication.getAppContext().openFileOutput(fileName, MODE_PRIVATE)).use {
                it.write(data)
            }
        } catch (e: IOException) {
            Timber.e(e, "File write to '$fileName' failed")
        }
    }

    @SuppressWarnings("LogNotTimber")
    fun appendToFile(fileName: String, data: String) {
        try {
            OutputStreamWriter(BudgetApplication.getAppContext().openFileOutput(fileName, MODE_APPEND)).use {
                it.write(data)
            }
        } catch (e: IOException) {
            // don't use Timber because Timber uses this method to write to file and we don't want recursive errors
            Log.e("FileService", "File append to '$fileName' failed", e)
        }
    }

    fun readFromFile(fileName: String): String? {
        try {
            return BudgetApplication.getAppContext().openFileInput(fileName).use {
                val reader = BufferedReader(InputStreamReader(it))
                reader.lines()
                        .collect(Collectors.joining("\n"))
            }
        } catch (e: FileNotFoundException) {
            Timber.e(e, "File '$fileName' not found")
        } catch (e: IOException) {
            Timber.e(e, "Can not read file '$fileName'")
        }
        return null
    }

    fun clearFile(fileName: String) {
        BudgetApplication.getAppContext().deleteFile(fileName)
    }
}

package com.georgeflug.budget.service

import android.content.Context.MODE_PRIVATE
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
            Timber.e("File write to '$fileName' failed: $e")
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
            Timber.e("File '$fileName' not found: $e")
        } catch (e: IOException) {
            Timber.e("Can not read file '$fileName': $e")
        }
        return null
    }

    fun clearFile(fileName: String) {
        BudgetApplication.getAppContext().deleteFile(fileName)
    }
}

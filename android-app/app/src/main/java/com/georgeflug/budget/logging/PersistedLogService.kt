package com.georgeflug.budget.logging

import com.georgeflug.budget.service.FileService

object PersistedLogService {
    private const val FILENAME = "log.dat"

    fun writeToLog(logMessage: String) {
        FileService.appendToFile(FILENAME, logMessage)
    }

    fun getLogs(): String {
        return FileService.readFromFile(FILENAME) ?: "ERROR: Could not read logs"
    }

    fun clearLog() {
        FileService.clearFile(FILENAME)
    }
}
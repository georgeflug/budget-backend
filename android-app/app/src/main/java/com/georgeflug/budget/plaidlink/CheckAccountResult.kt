package com.georgeflug.budget.plaidlink

class CheckAccountResult(
        val accountName: String,
        val status: CheckAccountStatus,
        val linkToken: String
)
package com.georgeflug.budget

data class TransactionApiResult(val result: String, val rows: List<HashMap<String, String>>)

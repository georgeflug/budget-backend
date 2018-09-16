package com.georgeflug.budget

import android.support.v7.app.AppCompatActivity
import android.os.Bundle
import android.widget.SimpleAdapter
import android.widget.Toast
import io.reactivex.Observable
import io.reactivex.android.schedulers.AndroidSchedulers
import io.reactivex.schedulers.Schedulers
import kotlinx.android.synthetic.main.activity_main.*
import java.math.BigDecimal
import java.net.URL
import java.text.SimpleDateFormat
import java.util.Date

class MainActivity : AppCompatActivity() {

    val budgets = listOf("Richie", "Stef", "Ben", "Big Necessities", "Charity", "Clothes - Stef", "Clothes - Richie", "Entertainment", "Groceries", "Mortgage", "Optional Important", "Gifts", "Christmas", "Richie - Projects", "Student Loan", "Subscriptions", "Home Supplies", "Travel", "Utilities")
    val descriptions = listOf("", "", "", "Health bills, car repairs, house repairs", "", "Clothes, hair, makeup", "", "Restaurants, bars, food, movies, outings, etc", "", "", "Gifts, optional house improvements, Christmas cards & gifts, photo books", "", "", "", "", "Insurance, Netflix, Amazon, Gym", "", "", "Internet, Phones, Electric, Water, Trash")

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)
        prepareBudgetSpinner()
        submitTransactionButton.setOnClickListener {
            val amount = BigDecimal(amountText.text.toString())
            val description = descriptionText.text.toString()
            val budget = (budgetText.selectedItem as HashMap<String, String>)["budget"]
            val date = SimpleDateFormat("MM-dd-yyyy").format(Date())
            val request = URL("https://script.google.com/macros/s/AKfycbzJXrwFepauVmiodXfe81zETyqgAMcwdjR8fRjJ1NvrcpAgPPg/exec?Date=$date&Amount=$amount&Budget=$budget&Description=$description")
            Observable.fromCallable { request.openStream().bufferedReader().use { it.readText() } }
                    .subscribeOn(Schedulers.io())
                    .observeOn(AndroidSchedulers.mainThread())
                    .subscribe({
                        Toast.makeText(this, it, Toast.LENGTH_LONG).show()
                        amountText.setText("")
                        descriptionText.setText("")
                    }, {
                        Toast.makeText(this, it.toString(), Toast.LENGTH_LONG).show()
                    })
        }
    }

    private fun prepareBudgetSpinner() {
        val items = budgets.mapIndexed { index, budget -> mutableMapOf("budget" to budget, "description" to descriptions[index]) }
                .sortedBy { it["budget"] }
                .toMutableList()
        val from = arrayOf("budget", "description")
        val to = intArrayOf(R.id.line1, R.id.line2)
        budgetText.adapter = SimpleAdapter(this, items, R.layout.spinner_two_lines, from, to)
    }
}

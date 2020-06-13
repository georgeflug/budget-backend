package com.georgeflug.budget.view.splash

import android.content.Intent
import android.os.Bundle
import android.view.View
import androidx.appcompat.app.AppCompatActivity
import com.georgeflug.budget.R
import com.georgeflug.budget.logging.LogActivity
import com.georgeflug.budget.view.main.MainActivity
import kotlinx.android.synthetic.main.activity_splash.*

class SplashActivity : AppCompatActivity() {
    private lateinit var presenter: SplashContract.Presenter

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        setContentView(R.layout.activity_splash)
        supportActionBar?.setDisplayHomeAsUpEnabled(true)

        presenter = SplashPresenter(object : SplashContract.View {
            override fun showMainAppPage() {
                showMainActivity()
            }

            override fun displayStatus(status: String) {
                statusText.text = status
            }

            override fun displayLogButton() {
                viewLogsButton.visibility = View.VISIBLE
            }
        })
        presenter.load(this)

        viewLogsButton.setOnClickListener {
            showLogActivity()
        }
    }

    override fun onStop() {
        super.onStop()
        presenter.unload()
    }

    private fun showMainActivity() {
        startActivity(Intent(this, MainActivity::class.java))
    }

    private fun showLogActivity() {
        startActivity(LogActivity.getIntent(this))
    }
}

package com.georgeflug.budget.view.splash

import android.content.Intent
import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import com.georgeflug.budget.R
import com.georgeflug.budget.view.main.MainActivity
import kotlinx.android.synthetic.main.activity_splash.*

/**
 * An example full-screen activity that shows and hides the system UI (i.e.
 * status bar and navigation/system bar) with user interaction.
 */
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
        })
        presenter.load(this)
    }

    override fun onStop() {
        super.onStop()
        presenter.unload()
    }

    private fun showMainActivity() {
        startActivity(Intent(this, MainActivity::class.java))
    }
}

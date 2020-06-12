package com.georgeflug.budget.view.splash

import android.app.Activity

interface SplashContract {
    interface View {
        fun showMainAppPage()
        fun displayStatus(status: String)
    }

    interface Presenter {
        fun load(activity: Activity)
        fun unload()
    }
}

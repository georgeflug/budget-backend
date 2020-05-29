package com.georgeflug.budget.view.splash

import android.app.Activity

interface SplashContract {
    interface View {
        fun showMainAppPage()
    }

    interface Presenter {
        fun load(activity: Activity)
    }
}

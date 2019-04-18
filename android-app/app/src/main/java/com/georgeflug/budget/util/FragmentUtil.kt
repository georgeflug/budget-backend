package com.georgeflug.budget.util

import android.app.Fragment
import com.georgeflug.budget.R
import com.georgeflug.budget.view.main.MainActivity

object FragmentUtil {

    fun showAndAddToBackStack(fragment: Fragment) {
        MainActivity.fragmentManager
                .beginTransaction()
                .replace(R.id.fragmentContainer, fragment)
                .addToBackStack(null)
                .commit()
        MainActivity.addToBackStack(fragment)
    }

    fun showFragment(fragment: Fragment) {
        MainActivity.fragmentManager
                .beginTransaction()
                .replace(R.id.fragmentContainer, fragment)
                .commit()
    }

    fun popBackStack() {
        MainActivity.fragmentManager.popBackStack()
    }

}
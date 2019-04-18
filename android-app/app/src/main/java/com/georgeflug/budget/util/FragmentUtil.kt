package com.georgeflug.budget.util

import android.app.Fragment
import android.app.FragmentManager
import com.georgeflug.budget.R
import com.georgeflug.budget.view.main.MainActivity

object FragmentUtil {
    val EditDetailsWorkflowStack = "EditDetailsWorkflowStack"

    fun showAndAddToBackStack(fragment: Fragment) {
        showAndAddToBackStack(fragment, null)
    }

    fun showAndAddToBackStack(fragment: Fragment, name: String?) {
        MainActivity.fragmentManager
                .beginTransaction()
                .replace(R.id.fragmentContainer, fragment)
                .addToBackStack(name)
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

    fun clearBackStack() {
        popBackStackTo(null)
    }

    fun popBackStackTo(name: String?) {
        MainActivity.fragmentManager.popBackStack(name, FragmentManager.POP_BACK_STACK_INCLUSIVE)
    }

}
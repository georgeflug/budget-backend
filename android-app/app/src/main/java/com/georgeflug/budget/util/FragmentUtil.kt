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
        MainActivity.popFromBackStack()
    }

    fun clearBackStack() {
        popBackStackTo(null)
        while (MainActivity.backStackSize() > 0) {
            MainActivity.popFromBackStack()
        }
    }

    fun popBackStackTo(name: String?) {
        val startSize = MainActivity.fragmentManager.backStackEntryCount
        MainActivity.fragmentManager.popBackStackImmediate(name, FragmentManager.POP_BACK_STACK_INCLUSIVE)
        val stopSize = MainActivity.fragmentManager.backStackEntryCount
        for (i in stopSize until startSize) {
            MainActivity.popFromBackStack()
        }
    }

}
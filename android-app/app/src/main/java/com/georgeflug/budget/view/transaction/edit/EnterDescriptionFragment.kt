package com.georgeflug.budget.view.transaction.edit

import android.app.Fragment
import android.content.Context
import android.os.Bundle
import android.text.Editable
import android.text.TextWatcher
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.view.inputmethod.InputMethodManager
import com.georgeflug.budget.R
import com.georgeflug.budget.util.FragmentUtil
import kotlinx.android.synthetic.main.fragment_enter_description.*

class EnterDescriptionFragment : Fragment() {

    var description: String = ""
    var isSuccess = false

    override fun onCreateView(inflater: LayoutInflater, container: ViewGroup, savedInstanceState: Bundle?): View {
        return inflater.inflate(R.layout.fragment_enter_description, container, false)
    }

    override fun onResume() {
        super.onResume()

        doneButton.setOnClickListener {
            isSuccess = true
            hideKeyboard()
            FragmentUtil.popBackStackTo(FragmentUtil.EditDetailsWorkflowStack)
        }

        descriptionText.addTextChangedListener(object : TextWatcher {
            override fun afterTextChanged(s: Editable?) {}

            override fun beforeTextChanged(s: CharSequence?, start: Int, count: Int, after: Int) {}

            override fun onTextChanged(s: CharSequence, start: Int, before: Int, count: Int) {
                description = s.toString()
            }
        })

        descriptionText.setText(description)
    }

    private fun hideKeyboard() {
        val imm = context.getSystemService(Context.INPUT_METHOD_SERVICE) as InputMethodManager
        imm.hideSoftInputFromWindow(view.getWindowToken(), 0)
    }

}

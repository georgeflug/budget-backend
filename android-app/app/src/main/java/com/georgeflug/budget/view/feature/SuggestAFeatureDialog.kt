package com.georgeflug.budget.view.feature

import android.app.Dialog
import android.content.Context
import android.os.Bundle
import android.view.Window
import android.view.WindowManager
import android.widget.Toast
import com.georgeflug.budget.R
import com.georgeflug.budget.api.BudgetApi
import com.georgeflug.budget.model.FeatureIdea
import io.reactivex.android.schedulers.AndroidSchedulers
import kotlinx.android.synthetic.main.dialog_suggest_feature.*
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale

class SuggestAFeatureDialog(context: Context) : Dialog(context) {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        requestWindowFeature(Window.FEATURE_NO_TITLE)
        setContentView(R.layout.dialog_suggest_feature)
        window.setLayout(WindowManager.LayoutParams.MATCH_PARENT, WindowManager.LayoutParams.WRAP_CONTENT)

        suggestFeatureCancelButton.setOnClickListener {
            dismiss()
        }
        suggestFeatureSubmitButton.setOnClickListener {
            val date = SimpleDateFormat("MM-dd-yyyy", Locale.US).format(Date())
            val description = featureDescription.text.toString()
            val newIdea = FeatureIdea(date = date, description = description)
            BudgetApi.featureIdeas.createFeatureIdea(newIdea)
                    .observeOn(AndroidSchedulers.mainThread())
                    .subscribe({
                        Toast.makeText(context, "Thanks!", Toast.LENGTH_LONG).show()
                        dismiss()
                    }, {
                        Toast.makeText(context, it.toString(), Toast.LENGTH_LONG).show()
                    })
        }
    }

}
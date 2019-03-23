package com.georgeflug.budget.api

import com.georgeflug.budget.model.FeatureIdea
import io.reactivex.Observable
import retrofit2.http.Body
import retrofit2.http.POST

interface FeatureApi {
    @POST("feature-ideas")
    fun createFeatureIdea(@Body featureIdea: FeatureIdea): Observable<FeatureIdea>
}

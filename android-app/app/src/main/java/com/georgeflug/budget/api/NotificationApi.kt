package com.georgeflug.budget.api

import com.georgeflug.budget.model.NotificationRegistrationInfo
import io.reactivex.Observable
import retrofit2.http.Body
import retrofit2.http.POST

interface NotificationApi {
    @POST("notifications/register")
    fun registerApp(@Body registration: NotificationRegistrationInfo): Observable<String>
}

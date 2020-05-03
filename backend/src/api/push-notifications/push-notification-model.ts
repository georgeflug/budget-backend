export type PushNotificationRegistrationModel = {
  registrationToken: string
  owner: string
}

export type PushNotificationTestModel = {
  registrationToken: string
  message: string
}

export enum Owner {
  Richie,
  Stef
}

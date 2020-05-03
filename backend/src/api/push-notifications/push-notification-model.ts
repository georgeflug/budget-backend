export type PushNotificationRegistrationModel = {
  registrationToken: string
  owner: string
}

export type PushNotificationTestModel = {
  registrationToken: string
  title: string
  message: string
}

export enum Owner {
  Richie = 'Richie',
  Stef = 'Stef'
}

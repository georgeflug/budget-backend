import { PushNotificationRegistrationModel, PushNotificationTestModel } from "./push-notification-model";
import { sendNotification } from "../../firebase/admin";

export async function registerNotification(body: PushNotificationRegistrationModel) {
}

export async function testNotification(body: PushNotificationTestModel) {
  await sendNotification(body.registrationToken, body.title, body.message);
}

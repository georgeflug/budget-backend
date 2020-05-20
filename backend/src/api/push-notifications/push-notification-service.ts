import { PushNotificationRegistrationModel, PushNotificationTestModel } from "./push-notification-model";
import { sendNotification } from "../../firebase/admin";

export async function registerNotification(body: PushNotificationRegistrationModel) {
}

export async function testNotification(body: PushNotificationTestModel) {
  // note: registrationToken for my phone was: fYtabBmeQHuGissrz-WpsX:APA91bEI17SvW7635g219ycwTytPx4eoqqy3Kx7VB4sIV427s_lGU2K4q-jdP8V6_ZkCPVZhuHcG-5CJE6kxVQU9Cn8HxPeslakljaXQZoaGQfGlmdSW2mCcc5db-I5zCaD1zaWlteEu
  await sendNotification(body.registrationToken, body.title, body.message);
}

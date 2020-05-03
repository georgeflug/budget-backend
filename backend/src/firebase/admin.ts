import * as firebase from "firebase-admin";
import { admin } from "firebase-admin/lib/messaging";
import MessagingPayload = admin.messaging.MessagingPayload;

const firebaseKey = require("./firebase-key.json");

firebase.initializeApp({
  credential: firebase.credential.cert(firebaseKey),
  databaseURL: "https://budget-app-14e97.firebaseio.com"
});

const notificationOptions = {
  priority: "high",
  timeToLive: 60 * 60 * 24
};

export async function sendNotification(registrationToken, title, message) {
  const payload: MessagingPayload = {
    notification: {
      title: title,
      body: message
    }
  };
  return await firebase.messaging().sendToDevice(registrationToken, payload, notificationOptions)
}


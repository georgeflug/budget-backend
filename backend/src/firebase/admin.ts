import * as admin from 'firebase-admin';

var serviceAccount = require("./julla-tutorial.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://budget-app-14e97.firebaseio.com"
});

const notificationOptions = {
  priority: "high",
  timeToLive: 60 * 60 * 24
};

export async function sendNotification(registrationToken, message) {
  return await admin.messaging().sendToDevice(registrationToken, message, notificationOptions)
}


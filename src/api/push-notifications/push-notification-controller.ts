import express from 'express';
import { registerNotification, testNotification } from "./push-notification-service";

export const router = express.Router();

router.route('/notifications/register')
  .post(function (req, res) {
    registerNotification(req.body);
    res.status(200).json({ status: 'ok' });
  });

router.route('/notifications/test')
  .post(function (req, res) {
    testNotification(req.body);
    res.status(200).json({ status: 'ok' });
  });

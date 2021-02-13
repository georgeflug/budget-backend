import {checkAccounts} from "./check-accounts-service";

const express = require('express');
export const router = express.Router();

router.route('/check-account-connectivity')
    .get(async function (req, res) {
      res.send(await checkAccounts());
    });

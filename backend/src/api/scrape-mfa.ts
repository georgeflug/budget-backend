// temporary code to have typescript recognize this file as a module
export {};

const mfaCodes = require('../scrape/mfa-codes');
const express = require('express');

const router = express.Router();

router.route('/scrape/fccu/mfa')
    .post(function (req, res) {
      mfaCodes.saveFccu(req.body.token);
      res.status(204).end();
    })
    .get(function (req, res) {
      mfaCodes.getFccuToken().then(token => {
        res.json({
          token
        });
      })
    });

module.exports = router;

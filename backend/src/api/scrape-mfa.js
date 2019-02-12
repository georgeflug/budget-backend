const mfaCodes = require('../scrape/mfa-codes');
const express = require('express');

const router = express.Router();

router.route('/scrape/fccu/mfa')
  .post(function (req, res, next) {
    mfaCodes.saveFccu(req.body.token);
    res.status(204).end();
  })
  .get(function (req, res, next) {
    mfaCodes.getFccuToken().then(token => {
      res.json({
        token
      });
    })
  });

module.exports = router;

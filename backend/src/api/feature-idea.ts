// temporary code to have typescript recognize this file as a module
export { };

import express from 'express';
import FeatureIdeaModel from '../db/feature-idea';

var router = express.Router();

router.route('/feature-ideas')
  .post(function (req, res, next) {
    var featureIdea = new FeatureIdeaModel(req.body);

    featureIdea.save(function (err: Error) {
      if (err) {
        next(err);
      } else {
        res.json(featureIdea);
      }
    });
  })
  .get(function (req, res, next) {
    FeatureIdeaModel.find({}, function (err: Error, featureIdeas) {
      if (err) {
        res.send(err);
      } else {
        res.json(featureIdeas);
      }
    });
  });

module.exports = router;

// temporary code to have typescript recognize this file as a module
export { };

import express from 'express';
import mongoose from 'mongoose';

var router = express.Router();
const Schema = mongoose.Schema;

var FeatureIdeaSchema = new Schema({
  date: {
    type: Date,
    default: Date.now,
  },
  description: String,
});

mongoose.model('FeatureIdea', FeatureIdeaSchema);
var FeatureIdea = mongoose.model('FeatureIdea');

router.route('/feature-ideas')
  .post(function (req, res, next) {
    var featureIdea = new FeatureIdea(req.body);

    featureIdea.save(function (err: Error) {
      if (err) {
        next(err);
      } else {
        res.json(featureIdea);
      }
    });
  })
  .get(function (req, res, next) {
    FeatureIdea.find({}, function (err: Error, featureIdeas) {
      if (err) {
        res.send(err);
      } else {
        res.json(featureIdeas);
      }
    });
  });

module.exports = router;

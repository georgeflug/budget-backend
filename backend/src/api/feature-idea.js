const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var express = require('express');
var router = express.Router();

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

    featureIdea.save(function (err) {
      if (err) {
        next(err);
      } else {
        res.json(featureIdea);
      }
    });
  })
  .get(function (req, res, next) {
    FeatureIdea.find({}, function (err, featureIdeas) {
      if (err) {
        res.send(err);
      } else {
        res.json(featureIdeas);
      }
    });
  });

module.exports = router;

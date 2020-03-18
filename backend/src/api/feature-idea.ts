import express from 'express';
import {FeatureIdea, FeatureIdeaDbModel} from '../db/feature-idea';

export const router = express.Router();

router.route('/feature-ideas')
    .post(function (req, res, next) {
      var featureIdea = new FeatureIdeaDbModel(req.body);

      featureIdea.save(function (err: Error) {
        if (err) {
          next(err);
        } else {
          res.json(featureIdea);
        }
      });
    })
    .get(function (req, res) {
      FeatureIdeaDbModel.find({}, function (err: Error, featureIdeas: FeatureIdea[]) {
        if (err) {
          res.send(err);
        } else {
          res.json(featureIdeas);
        }
      });
    });

import express from 'express';
import {listFeatureIdeas, saveFeatureIdea} from "./feature-idea-service";

export const router = express.Router();

router.route('/feature-ideas')
    .post(function (req, res) {
      res.json(saveFeatureIdea(req.body));
    })
    .get(function (req, res) {
      res.json(listFeatureIdeas());
    });

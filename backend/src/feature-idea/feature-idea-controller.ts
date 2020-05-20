import express from "express";
import { listFeatureIdeas, saveFeatureIdea } from "./feature-idea-service";

export const router = express.Router();

router.route("/feature-ideas")
  .post(async function(req, res) {
    res.json(await saveFeatureIdea(req.body));
  })
  .get(async function(req, res) {
    res.json(await listFeatureIdeas());
  });

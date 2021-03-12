import express from 'express'
import { listFeatureIdeas, saveFeatureIdea } from './feature-idea-service'
import { Route } from '../api/route'

const router = express.Router()

router
  .route('/')
  .post(async function (req, res) {
    res.json(await saveFeatureIdea(req.body))
  })
  .get(async function (req, res) {
    res.json(await listFeatureIdeas())
  })

export const featureIdeaRoute: Route = {
  router,
  basePath: '/feature-ideas',
}

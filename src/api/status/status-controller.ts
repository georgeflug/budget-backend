import express from 'express'
import { Route } from '../route'

export const router = express.Router()

router.get('/', (req, res) => {
  res.send('{"status":"OK"}')
})

export const statusRoute: Route = {
  router,
  basePath: '/status',
}

import express from 'express'

export type Route = {
  router: express.Router
  basePath: string
}

import { debug, error } from '../log'
import * as http from 'http'
import { routes } from './routes'
import express from 'express'
import 'express-async-errors'

const app = express()
import * as morgan from 'morgan'
import * as cors from 'cors'
import * as compression from 'compression'

const port = 3000
// const https = require('https')
// const fs = require('fs')
// const serverOptions = {
//   key: fs.readFileSync("./certs/budget-backend-private.key"),
//   passphrase: config.budgetCertPassword,
//   cert: fs.readFileSync("./certs/budget-backend-public.crt")
// }

export function initExpress(): void {
  app.use(express.json())
  app.use(
    morgan(
      ':date[iso] ACCESS ":method :url HTTP/:http-version" Remote:":remote-addr - :remote-user" Response: ":status - :response-time ms" Referrer:":referrer" User-agent:":user-agent"',
    ),
  )
  app.use(compression())
  app.use(cors())
  app.use(express.static('../../budget-web/build'))

  routes.forEach(route => app.use(route.basePath, route.router))

  app.use(function (err: Error, req, res, _next) {
    error('GLOBAL ERROR', 'Uncaught Exception', err)
    res.status(500).send({
      message: err.message || err,
    })
  })

  // https.createServer(serverOptions, app).listen(port)
  http.createServer(app).listen(port)

  debug('Startup', `Listening on localhost:${port}`)
}

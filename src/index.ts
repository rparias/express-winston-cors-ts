import express from 'express'
import * as http from 'http'
import * as winston from 'winston'
import * as expressWinston from 'express-winston'
import cors from 'cors'
import dotenv from 'dotenv'
import { CommonRoutesConfig } from './common/common.routes.config'
import { UsersRoutes } from './users/users.routes.config'
import { AuthRoutes } from './auth/auth.routes.config'
import debug from 'debug'

const dotenvResult = dotenv.config()
if (dotenvResult.error != null) {
  throw dotenvResult.error
}

const app: express.Application = express()
const server: http.Server = http.createServer(app)
const port = 3001
const routes: CommonRoutesConfig[] = []
const debugLog: debug.IDebugger = debug('app')

// here we are adding middleware to parse all incoming requests as JSON
app.use(express.json())

// here we are adding middleware to allow cross-origin requests
app.use(cors())

const loggerOptions: expressWinston.LoggerOptions = {
  transports: [new winston.transports.Console()],
  format: winston.format.combine(
    winston.format.json(),
    winston.format.prettyPrint(),
    winston.format.colorize({ all: true })
  )
}

if (process.env.DEBUG === null || process.env.DEBUG === undefined || process.env.DEBUG === '') {
  loggerOptions.meta = false // when not debugging, log requests as one-liners
}

app.use(expressWinston.logger(loggerOptions))

routes.push(new UsersRoutes(app))
routes.push(new AuthRoutes(app))

const runningMessage = `Server running at http://localhost:${port}`

app.get('/', (_req: express.Request, res: express.Response) => {
  res.status(200).send(runningMessage)
})

server.listen(port, () => {
  routes.forEach((route: CommonRoutesConfig) => {
    debugLog(`Routes configured for ${route.getName()}`)
  })
})

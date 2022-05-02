import { CommonRoutesConfig } from '../common/common.routes.config'
import express, { Request, Response, NextFunction } from 'express'

export class UsersRoutes extends CommonRoutesConfig {
  constructor (app: express.Application) {
    super(app, 'UsersRoutes')
  }

  configureRoutes (): express.Application {
    this.app.route('/users')
      .get((_req: Request, res: Response) => {
        res.status(200).send('List of users')
      })
      .post((_req: Request, res: Response) => {
        res.status(200).send('Post of users')
      })

    this.app.route('/users/:userId')
      .all((_req: Request, _res: Response, _next: NextFunction) => {
        // this middleware function runs before any request to /users/:userId
      })
      .get((req: Request, res: Response) => {
        res.status(200).send(`GET requested for id ${req.params.userId}`)
      })
      .put((req: Request, res: Response) => {
        res.status(200).send(`PUT requested for id ${req.params.userId}`)
      })
      .patch((req: Request, res: Response) => {
        res.status(200).send(`PATCH requested for id ${req.params.userId}`)
      })
      .delete((req: Request, res: Response) => {
        res.status(200).send(`DELETE requested for id ${req.params.userId}`)
      })

    return this.app
  }
}

import { Request, Response, NextFunction } from 'express'
import usersService from '../services/users.service'
import debug from 'debug'

const log: debug.IDebugger = debug('app:users-controller-middleware')

class UsersMiddleware {
  async validateRequiredUserBodyFields (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    /* eslint-disable @typescript-eslint/strict-boolean-expressions */
    if (req?.body && req.body.email && req.body.password) {
      next()
    } else {
      res.status(400).send({
        error: 'Missing required fields email and password'
      })
    }
  }

  async validateSameEmailDoesntExist (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const user = await usersService.getUserByEmail(req.body.email)
    if (user != null) {
      res.status(401).send({
        error: 'User email already exists'
      })
    } else {
      next()
    }
  }

  async validateSameEmailBelongToSameUser (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const user = await usersService.getUserByEmail(req.body.email)
    if (user && user._id === req.params.userId) {
      next()
    } else {
      res.status(401).send({
        error: 'Invalid email'
      })
    }
  }

  // Here we need to use an arrow function to bind `this` correctly
  validatePatchEmail = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    if (req.body.email) {
      log('Validating email', req.body.email)
      await this.validateSameEmailBelongToSameUser(req, res, next)
    } else {
      next()
    }
  }

  async validateUserExists (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const user = await usersService.readById(req.params.userId)
    if (user) {
      next()
    } else {
      res.status(401).send({
        error: `User ${req.params.userId} not found`
      })
    }
  }

  async extractUserId (
    req: Request,
    _res: Response,
    next: NextFunction
  ): Promise<void> {
    req.body.id = req.params.userId
    next()
  }
}

export default new UsersMiddleware()

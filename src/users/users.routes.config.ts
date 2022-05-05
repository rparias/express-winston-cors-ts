import { body } from 'express-validator'
import { CommonRoutesConfig } from '../common/common.routes.config'
import bodyValidationMiddleware from '../common/middleware/body.validation.middleware'
import UsersController from './controllers/users.controller'
import UsersMiddleware from './middleware/users.middleware'
import express from 'express'

export class UsersRoutes extends CommonRoutesConfig {
  constructor (app: express.Application) {
    super(app, 'UsersRoutes')
  }

  configureRoutes (): express.Application {
    this.app.route('/users')
      .get(UsersController.listUsers)
      .post(
        body('email').isEmail(),
        body('password')
          .isLength({ min: 5 })
          .withMessage('Must include password (5+ characters)'),
        bodyValidationMiddleware.verifyBodyFieldsErrors,
        UsersMiddleware.validateSameEmailDoesntExist,
        UsersController.createUser
      )

    this.app.param('userId', UsersMiddleware.extractUserId)

    this.app.route('/users/:userId')
      .all(UsersMiddleware.validateUserExists)
      .get(UsersController.getUserById)
      .delete(UsersController.removeUser)

    this.app.put('/users/:userId', [
      body('email').isEmail(),
      body('password')
        .isLength({ min: 5 })
        .withMessage('Must include password (5+ characters)'),
      body('firstName').isString(),
      body('lastName').isString(),
      body('permissionFlags').isInt(),
      bodyValidationMiddleware.verifyBodyFieldsErrors,
      UsersMiddleware.validateSameEmailBelongToSameUser,
      UsersController.putUser
    ])

    this.app.patch('/users/:userId', [
      body('email').isEmail(),
      body('password')
        .isLength({ min: 5 })
        .withMessage('Must include password (5+ characters)')
        .optional(),
      body('firstName').isString().optional(),
      body('lastName').isString().optional(),
      body('permissionFlags').isInt().optional(),
      bodyValidationMiddleware.verifyBodyFieldsErrors,
      UsersMiddleware.validatePatchEmail,
      UsersController.patchUser
    ])

    return this.app
  }
}

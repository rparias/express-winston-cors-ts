import express from 'express'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import dotenv from 'dotenv'
import { Jwt } from '../../common/types/jwt'
import usersService from '../../users/services/users.service'
dotenv.config({ path: process.cwd() + '/.env' })

// @ts-expect-error
const jwtSecret: string = process.env.JWT_SECRET

class JwtMiddleware {
  verifyRefreshBodyField (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ): any {
    if (req?.body != null && req.body.refreshToken != null) {
      return next()
    } else {
      return res.status(400).send({
        errors: ['Missing required field: refreshToken']
      })
    }
  }

  /**
  * The validRefreshNeeded() function verifies if the refresh token is correct for a specific user ID.
  * If it is, then below we’ll reuse authController.createJWT to generate a new JWT for the user.
  */
  async validRefreshNeeded (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ): Promise<any> {
    const user: any = await usersService.getUserByEmailWithPassword(
      res.locals.jwt.email
    )
    const salt = crypto.createSecretKey(
      Buffer.from(res.locals.jwt.refreshKey.data)
    )
    const hash = crypto
      .createHmac('sha512', salt)
      .update(String(res.locals.jwt.userId) + jwtSecret)
      .digest('base64')
    if (hash === req.body.refreshToken) {
      req.body = {
        userId: user._id,
        email: user.email,
        permissionFlags: user.permissionFlags
      }
      return next()
    } else {
      return res.status(400).send({
        errors: ['Invalid refresh token']
      })
    }
  }

  /**
  * The validJWTNeeded() validates whether the API consumer sent a valid JWT in the HTTP headers
  * respecting the convention Authorization: Bearer <token>
  */
  validJWTNeeded (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ): any {
    if (req.headers.authorization != null) {
      try {
        const authorization = req.headers.authorization.split(' ')
        if (authorization[0] !== 'Bearer') {
          return res.status(401).send()
        } else {
          res.locals.jwt = jwt.verify(
            authorization[1],
            jwtSecret
          ) as Jwt
          next()
        }
      } catch (error) {
        return res.status(403).send()
      }
    } else {
      return res.status(401).send()
    }
  }
}

export default new JwtMiddleware()

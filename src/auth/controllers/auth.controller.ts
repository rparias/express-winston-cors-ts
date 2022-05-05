import express from 'express'
import debug from 'debug'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'

const log: debug.IDebugger = debug('app:auth-controller')

// @ts-expect-error
const jwtSecret: string = process.env.JWT_SECRET
const tokenExpirationInSeconds = 36000

class AuthController {
  async createJWT (req: express.Request, res: express.Response): Promise<any> {
    try {
      const refreshId = String(req.body.userId) + jwtSecret
      const salt = crypto.createSecretKey(crypto.randomBytes(16))
      const hash = crypto
        .createHmac('sha512', salt)
        .update(refreshId)
        .digest('base64')

      req.body.refreshKey = salt.export()

      const token = jwt.sign(req.body, jwtSecret, {
        expiresIn: tokenExpirationInSeconds
      })

      return res
        .status(201)
        .send({
          accessToken: token, // accessToken is used for any request beyond what’s available to the general public
          refreshToken: hash // refreshToken is used to request a replacement for an expired accessToken
        })
    } catch (error) {
      log('createJWT error %0', error)
      return res.status(500).send()
    }
  }
}

export default new AuthController()

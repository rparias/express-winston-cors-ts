import express from 'express'
import { PermissionFlag } from './common.permissionflag.enum'
import debug from 'debug'

const log: debug.IDebugger = debug('app:common-permission-middleware')

class CommonPermissionMiddleware {
  permissionFlagRequired (requiredPermissionFlag: PermissionFlag) {
    return (
      _req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) => {
      try {
        const userPermissionFlags = parseInt(res.locals.jwt.permissionFlags)
        // here we apply the bitwise operator
        if ((userPermissionFlags & requiredPermissionFlag) !== 0) {
          next()
        } else {
          res.status(403).send()
        }
      } catch (error) {
        log(error)
      }
    }
  }

  async onlySameUserOrAdminCanDoThisAction (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ): Promise<any> {
    const userPermissionFlags = parseInt(res.locals.jwt.permissionFlags)
    if (
      req.params?.userId != null &&
      req.params.userId === res.locals.jwt.userId
    ) {
      return next()
    } else {
      if ((userPermissionFlags & PermissionFlag.ADMIN_PERMISSION) !== 0) {
        return next()
      } else {
        return res.status(403).send()
      }
    }
  }
}

export default new CommonPermissionMiddleware()

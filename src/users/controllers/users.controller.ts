import { Request, Response } from 'express'
import UsersService from '../services/users.service'
import argon2 from 'argon2'
import debug from 'debug'

const log: debug.IDebugger = debug('app:users-controller')

class UsersController {
  async listUsers (_req: Request, res: Response): Promise<void> {
    const users = await UsersService.list(100, 0)
    res.status(200).send(users)
  }

  async getUserById (req: Request, res: Response): Promise<void> {
    const user = await UsersService.readById(req.body.id)
    res.status(200).send(user)
  }

  async createUser (req: Request, res: Response): Promise<void> {
    req.body.password = await argon2.hash(req.body.password)
    const userId = UsersService.create(req.body)
    res.status(201).send({ id: userId })
  }

  async patchUser (req: Request, res: Response): Promise<void> {
    if (req.body.password !== null || req.body.password !== undefined || req.body.password !== '') {
      req.body.password = await argon2.hash(req.body.password)
    }
    log(await UsersService.patchById(req.body.id, req.body))
    res.status(204).send()
  }

  async putUser (req: Request, res: Response): Promise<void> {
    req.body.password = await argon2.hash(req.body.password)
    log(await UsersService.putById(req.body.id, req.body))
    res.status(204).send()
  }

  async removeUser (req: Request, res: Response): Promise<void> {
    log(await UsersService.deleteById(req.body.id))
    res.status(204).send() // HTTP 204 No Content response are in line with RFC 7231
  }
}

export default new UsersController()

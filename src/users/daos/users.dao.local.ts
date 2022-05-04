import { CreateUserDto } from '../dto/create.user.dto'
import { PatchUserDto } from '../dto/patch.user.dto'
import { PutUserDto } from '../dto/put.user.dto'
import shortid from 'shortid'
import debug from 'debug'

const log: debug.IDebugger = debug('app:in-memory-dao')

class UsersDaoLocal {
  users: CreateUserDto[] = []

  constructor () {
    log('Created new instance of UsersDao')
  }

  async addUser (user: CreateUserDto): Promise<string> {
    user._id = shortid.generate()
    this.users.push(user)
    return user._id
  }

  async getUsers (): Promise<CreateUserDto[]> {
    return this.users
  }

  async getUserById (userId: string): Promise<CreateUserDto | undefined> {
    return this.users.find((user: {_id: string}) => user._id === userId)
  }

  async putUserById (userId: string, user: PutUserDto): Promise<string> {
    const objIndex = this.users.findIndex(
      (obj: {_id: string}) => obj._id === userId
    )
    this.users.splice(objIndex, 1, user)
    return `${user._id} updated via put`
  }

  async patchUserById (userId: string, user: PatchUserDto): Promise<string> {
    const objIndex = this.users.findIndex(
      (obj: {_id: string}) => obj._id === userId
    )
    const currentUser = this.users[objIndex]
    const allowedPatchFields = [
      'password',
      'firstName',
      'lastName',
      'permissionLevel'
    ]
    for (const field of allowedPatchFields) {
      if (field in user) {
        // @ts-expect-error
        currentUser[field] = user[field]
      }
    }
    this.users.splice(objIndex, 1, currentUser)
    return `${userId} patched`
  }

  async removeUserById (userId: string): Promise<string> {
    const objIndex = this.users.findIndex(
      (obj: {_id: string}) => obj._id === userId
    )
    this.users.splice(objIndex, 1)
    return `${userId} removed`
  }

  async getUserByEmail (email: string): Promise<CreateUserDto | null> {
    const objIndex = this.users.findIndex(
      (obj: { email: string }) => obj.email === email
    )
    const currentUser = this.users[objIndex]
    if (currentUser !== undefined || currentUser !== null) {
      return currentUser
    } else {
      return null
    }
  }
}

export default new UsersDaoLocal()

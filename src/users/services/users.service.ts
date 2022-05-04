import UsersDaoMongo from '../daos/users.dao.mongo'
import { CRUD } from '../../common/interfaces/crud.interface'
import { CreateUserDto } from '../dto/create.user.dto'
import { PutUserDto } from '../dto/put.user.dto'
import { PatchUserDto } from '../dto/patch.user.dto'

class UsersService implements CRUD {
  async create (resource: CreateUserDto): Promise<string> {
    return await UsersDaoMongo.addUser(resource)
  }

  async deleteById (id: string): Promise<string> {
    return await UsersDaoMongo.removeUserById(id)
  }

  async list (limit: number, page: number): Promise<CreateUserDto[]> {
    return await UsersDaoMongo.getUsers(limit, page)
  }

  async patchById (id: string, resource: PatchUserDto): Promise<string> {
    return await UsersDaoMongo.updateUserById(id, resource)
  }

  async readById (id: string): Promise<CreateUserDto | undefined> {
    return await UsersDaoMongo.getUserById(id)
  }

  async putById (id: string, resource: PutUserDto): Promise<string> {
    return await UsersDaoMongo.updateUserById(id, resource)
  }

  async getUserByEmail (email: string): Promise<CreateUserDto | null> {
    return await UsersDaoMongo.getUserByEmail(email)
  }
}

export default new UsersService()

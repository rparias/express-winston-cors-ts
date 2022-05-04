import UsersDaoLocal from '../daos/users.dao.local'
import { CRUD } from '../../common/interfaces/crud.interface'
import { CreateUserDto } from '../dto/create.user.dto'
import { PutUserDto } from '../dto/put.user.dto'
import { PatchUserDto } from '../dto/patch.user.dto'

class UsersService implements CRUD {
  async create (resource: CreateUserDto): Promise<string> {
    return await UsersDaoLocal.addUser(resource)
  }

  async deleteById (id: string): Promise<string> {
    return await UsersDaoLocal.removeUserById(id)
  }

  async list (_limit: number, _page: number): Promise<CreateUserDto[]> {
    return await UsersDaoLocal.getUsers()
  }

  async patchById (id: string, resource: PatchUserDto): Promise<string> {
    return await UsersDaoLocal.patchUserById(id, resource)
  }

  async readById (id: string): Promise<CreateUserDto | undefined> {
    return await UsersDaoLocal.getUserById(id)
  }

  async putById (id: string, resource: PutUserDto): Promise<string> {
    return await UsersDaoLocal.putUserById(id, resource)
  }

  async getUserByEmail (email: string): Promise<CreateUserDto | null> {
    return await UsersDaoLocal.getUserByEmail(email)
  }
}

export default new UsersService()

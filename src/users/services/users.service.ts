import UsersDao from '../daos/users.dao'
import { CRUD } from '../../common/interfaces/crud.interface'
import { CreateUserDto } from '../dto/create.user.dto'
import { PutUserDto } from '../dto/put.user.dto'
import { PatchUserDto } from '../dto/patch.user.dto'

class UsersService implements CRUD {
  async create (resource: CreateUserDto): Promise<string> {
    return await UsersDao.addUser(resource)
  }

  async deleteById (id: string): Promise<string> {
    return await UsersDao.removeUserById(id)
  }

  async list (_limit: number, _page: number): Promise<CreateUserDto[]> {
    return await UsersDao.getUsers()
  }

  async patchById (id: string, resource: PatchUserDto): Promise<string> {
    return await UsersDao.patchUserById(id, resource)
  }

  async readById (id: string): Promise<CreateUserDto | undefined> {
    return await UsersDao.getUserById(id)
  }

  async putById (id: string, resource: PutUserDto): Promise<string> {
    return await UsersDao.putUserById(id, resource)
  }

  async getUserByEmail (email: string): Promise<CreateUserDto | null> {
    return await UsersDao.getUserByEmail(email)
  }
}

export default new UsersService()

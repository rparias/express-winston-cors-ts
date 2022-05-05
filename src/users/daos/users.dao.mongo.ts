import { CreateUserDto } from '../dto/create.user.dto'
import { PatchUserDto } from '../dto/patch.user.dto'
import { PutUserDto } from '../dto/put.user.dto'
import mongooseService from '../../common/services/mongoose.service'
import shortid from 'shortid'
import debug from 'debug'

const log: debug.IDebugger = debug('app:mongo-dao')

class UsersDaoMongo {
  Schema = mongooseService.getMongoose().Schema

  userSchema = new this.Schema({
    _id: String,
    email: String,
    password: {
      type: String,
      select: false // this will hide the field when get or list users
    },
    firstName: String,
    lastName: String,
    permissionFlags: Number
  }, { id: false })

  User = mongooseService.getMongoose().model('Users', this.userSchema)

  constructor () {
    log('Created new instance of UsersDao')
  }

  async addUser (user: CreateUserDto): Promise<string> {
    const userId = shortid.generate()
    const newUser = new this.User({
      ...user,
      _id: userId,
      permissionFlags: 1
    })
    await newUser.save()
    return userId
  }

  async getUsers (limit = 25, page = 0): Promise<CreateUserDto[]> {
    return await this.User.find()
      .limit(limit)
      .skip(limit * page)
      .exec()
  }

  async getUserById (userId: string): Promise<CreateUserDto | undefined> {
    return await this.User.findOne({ _id: userId }).exec()
  }

  async getUserByEmail (email: string): Promise<any> {
    return await this.User.findOne({ email: email }).exec()
  }

  async updateUserById (userId: string, user: PatchUserDto | PutUserDto): Promise<any> {
    const existingUser = await this.User.findOneAndUpdate(
      { _id: userId },
      { $set: user },
      { new: true } // new true option tell mongoose to return the object as iit is after the update
    ).exec()

    return existingUser
  }

  async removeUserById (userId: string): Promise<any> {
    return await this.User.deleteOne({ _id: userId }).exec()
  }

  async getUserByEmailWithPassword (email: string): Promise<any> {
    return await this.User.findOne({ email: email })
      .select(' _id email permissionFlags +password')
      .exec()
  }
}

export default new UsersDaoMongo()

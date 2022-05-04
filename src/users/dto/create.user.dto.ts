export interface CreateUserDto {
  _id: string
  email: string
  password: string
  firstName?: string
  lastName?: string
  permissionFlags?: number
}

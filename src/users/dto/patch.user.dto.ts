import { PutUserDto } from './put.user.dto'

// Partial creates a new type by copying another type and making all its fields optional
export interface PatchUserDto extends Partial<PutUserDto> {}

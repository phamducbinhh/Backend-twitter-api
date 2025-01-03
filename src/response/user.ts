import { UserType } from '~/types/users.type'

export class UserRespone implements UserType {
  id: number
  name: string
  email: string
  date_of_birth: Date
  bio: string
  location: string
  website: string
  username: string
  cover_photo: string
  avatar: string
  verify_status: number
  following: number // Số lượng người theo dõi
  followers: number // Số lượng người được theo dõi
  createdAt?: Date

  constructor(user: UserType) {
    this.id = user.id
    this.name = user.name
    this.email = user.email
    this.date_of_birth = user.date_of_birth
    this.bio = user.bio
    this.location = user.location
    this.website = user.website
    this.username = user.username
    this.cover_photo = user.cover_photo
    this.avatar = user.avatar
    this.verify_status = user.verify_status
    this.following = user.following.length // Lấy số lượng người đang theo dõi
    this.followers = user.followers.length // Lấy số lượng người được theo dõi
    this.createdAt = user.createdAt
  }

  public static toResponse(
    user: UserType
  ): Omit<UserType, 'password' | 'email_verify_token' | 'forgot_password_token' | 'createdAt' | 'updatedAt'> {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      date_of_birth: user.date_of_birth,
      bio: user.bio,
      location: user.location,
      website: user.website,
      username: user.username,
      cover_photo: user.cover_photo,
      avatar: user.avatar,
      verify_status: user.verify_status
    }
  }
}

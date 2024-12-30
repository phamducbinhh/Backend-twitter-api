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
  following: any[]
  followers: any[]

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
    this.following = this.mapFollowing(user.following)
    this.followers = this.mapFollowers(user.followers)
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
      avatar: user.avatar
    }
  }

  private mapFollowing(following: any[]): any[] {
    return following.map((item: any) => ({
      id: item.followed.id,
      username: item.followed.username,
      name: item.followed.name,
      email: item.followed.email
    }))
  }
  private mapFollowers(followers: any[]): any[] {
    return followers.map((item: any) => ({
      id: item.follow.id,
      username: item.follow.username,
      name: item.follow.name,
      email: item.follow.email
    }))
  }
}

import { PeopleFollow } from '~/constants/enums'
import { HttpStatusCode } from '~/constants/HttpStatusCode'
import { handleResponse } from '~/utils/response'
const db = require('../models')
const { Op } = require('sequelize')
class SearchService {
  private async searchTweets(q: string, limit: number, offset: number, userId?: string, people_follow?: PeopleFollow) {
    const whereClause: any = {
      content: { [Op.like]: `%${q}%` }
    }

    // Nếu peopleFollow là "1", lọc theo người dùng mà userId đang theo dõi
    if (people_follow === PeopleFollow.Following && userId) {
      const followedUserIds = await db.Follower.findAll({
        where: { user_id: userId },
        attributes: ['followed_user_id']
      })

      const followedIds = followedUserIds.map((followed: any) => followed.followed_user_id)

      whereClause.user_id = { [Op.in]: followedIds }
    }

    const tweets = await db.Tweet.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: db.User,
          as: 'author',
          attributes: ['id', 'username', 'name', 'avatar']
        },
        {
          model: db.TweetMedia,
          as: 'tweet_media',
          attributes: ['id', 'media_id'],
          include: [
            {
              model: db.Media,
              as: 'media',
              attributes: ['url', 'type']
            }
          ]
        }
      ],
      limit,
      offset
    })

    return {
      total: tweets.count,
      items: tweets.rows
    }
  }

  private async searchUsers(q: string, limit: number, offset: number) {
    const users = await db.User.findAndCountAll({
      where: {
        [Op.or]: [{ username: { [Op.like]: `%${q}%` } }, { name: { [Op.like]: `%${q}%` } }]
      },
      attributes: ['id', 'username', 'name', 'avatar'],
      limit,
      offset
    })

    return {
      total: users.count,
      items: users.rows
    }
  }

  private async searchHashtags(q: string, limit: number, offset: number) {
    const hashtags = await db.Hashtag.findAndCountAll({
      where: {
        name: { [Op.like]: `%${q}%` }
      },
      attributes: ['id', 'name'],
      limit,
      offset
    })

    return {
      total: hashtags.count,
      items: hashtags.rows
    }
  }

  private async searchMedia(q: string, limit: number, offset: number) {
    const media = await db.Media.findAndCountAll({
      where: {
        [Op.or]: [{ url: { [Op.like]: `%${q}%` } }, { type: { [Op.like]: `%${q}%` } }]
      },
      attributes: ['id', 'url', 'type'],
      limit,
      offset
    })

    return {
      total: media.count,
      items: media.rows
    }
  }

  async search({
    q,
    type,
    page = 1,
    limit = 10,
    userId,
    people_follow
  }: {
    q: string
    type: string
    page?: number
    limit?: number
    userId?: string
    people_follow?: PeopleFollow
  }) {
    if (!q || !type) {
      return handleResponse(HttpStatusCode.BAD_REQUEST, false, 'Query and type are required')
    }

    const offset = (page - 1) * limit

    let results

    switch (type) {
      case 'tweet':
        results = await this.searchTweets(q, limit, offset || 0, userId, people_follow)
        break
      case 'user':
        results = await this.searchUsers(q, limit, offset)
        break
      case 'hashtag':
        results = await this.searchHashtags(q, limit, offset)
        break
      case 'media':
        results = await this.searchMedia(q, limit, offset)
        break
      default:
        return handleResponse(HttpStatusCode.BAD_REQUEST, false, 'Invalid search type')
    }

    return handleResponse(HttpStatusCode.SUCCESS, true, 'Search results retrieved successfully', {
      currentPage: page,
      totalPages: Math.ceil(results.total / limit),
      totalItems: results.total,
      items: results.items
    })
  }
}

const searchService = new SearchService()

export default searchService

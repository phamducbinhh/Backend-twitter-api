import { HttpStatusCode } from '~/constants/HttpStatusCode'
import { USERS_MESSAGES } from '~/constants/messages'
import { handleResponse } from '~/utils/response'

const db = require('../models')
const { Op } = require('sequelize')

class ConversationService {
  async getConversations({
    sender_id,
    receiver_id,
    limit = 10,
    page = 1
  }: {
    sender_id: string
    receiver_id: string
    limit?: number
    page?: number
  }) {
    const offset = (page - 1) * limit

    // Truy vấn danh sách cuộc trò chuyện giữa người gửi và người nhận
    const { count, rows: conversations } = await db.Conversation.findAndCountAll({
      where: {
        [Op.or]: [
          {
            sender_id,
            receiver_id
          },
          {
            sender_id: receiver_id,
            receiver_id: sender_id
          }
        ]
      },
      include: [
        {
          model: db.User,
          as: 'sender', // Người gửi
          attributes: ['id', 'username', 'name', 'avatar']
        },
        {
          model: db.User,
          as: 'receiver', // Người nhận
          attributes: ['id', 'username', 'name', 'avatar']
        }
      ],
      attributes: ['id', 'sender_id', 'receiver_id', 'content', 'createdAt'],
      limit,
      offset,
      order: [['createdAt', 'ASC']]
    })

    if (!conversations) {
      return handleResponse(HttpStatusCode.NOT_FOUND, false, USERS_MESSAGES.NO_CONVERSATION)
    }

    const response = {
      currentPage: page,
      totalPages: Math.ceil(count / limit),
      totalItems: count,
      conversations
    }

    return handleResponse(HttpStatusCode.SUCCESS, true, USERS_MESSAGES.GET_CONVERSATIONS_SUCCESS, response)
  }

  async getReceivers({ user_id }: { user_id: string }) {
    const conversations = await db.Conversation.findAll({
      where: {
        [Op.or]: [
          { sender_id: user_id }, // Trường hợp user_id là người gửi
          { receiver_id: user_id } // Trường hợp user_id là người nhận
        ]
      },
      include: [
        {
          model: db.User,
          as: 'receiver',
          attributes: ['id', 'username', 'name', 'avatar']
        },
        {
          model: db.User,
          as: 'sender',
          attributes: ['id', 'username', 'name', 'avatar']
        }
      ],
      attributes: ['id', 'sender_id', 'receiver_id', 'content', 'updatedAt'],
      order: [['updatedAt', 'DESC']]
    })

    if (!conversations) {
      return handleResponse(HttpStatusCode.NOT_FOUND, false, USERS_MESSAGES.NO_CONVERSATION)
    }

    const receivers = conversations.map((conversation: any) => {
      const isSender = conversation.sender_id === user_id
      const otherUser = isSender ? conversation.receiver : conversation.sender

      return {
        id: otherUser.id,
        username: otherUser.username,
        name: otherUser.name,
        avatar: otherUser.avatar,
        lastContent: conversation.content,
        updatedAt: conversation.updatedAt
      }
    })

    // Tạo mảng mới để lưu trữ người nhận duy nhất
    const uniqueReceivers: any[] = []

    // Duyệt qua mảng receivers và thêm người nhận duy nhất vào uniqueReceivers
    for (const receiver of receivers) {
      // Kiểm tra nếu người nhận đã có trong uniqueReceivers
      const existingReceiver = uniqueReceivers.find((r) => r.id === receiver.id)

      if (!existingReceiver) {
        // Nếu người nhận chưa có trong mảng, thêm vào
        uniqueReceivers.push(receiver)
      } else {
        // Nếu người nhận đã có, kiểm tra và cập nhật thông tin nếu cần thiết
        if (new Date(existingReceiver.updatedAt) < new Date(receiver.updatedAt)) {
          existingReceiver.lastContent = receiver.lastContent
          existingReceiver.updatedAt = receiver.updatedAt
        }
      }
    }

    return handleResponse(HttpStatusCode.SUCCESS, true, USERS_MESSAGES.GET_CONVERSATIONS_SUCCESS, uniqueReceivers)
  }
}

const conversationService = new ConversationService()
export default conversationService

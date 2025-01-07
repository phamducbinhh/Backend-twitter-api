import { Server as ServerHttp } from 'http'
import { Server } from 'socket.io'
import { envConfig } from '~/constants/config'
import { UserVerifyStatus } from '~/constants/enums'
import { TokenPayload } from '~/types/users.type'
import { verifyAccessToken } from './commons'
const db = require('../models')

const initSocket = (httpServer: ServerHttp) => {
  //Khởi tạo Socket.IO
  const io = new Server(httpServer, {
    cors: {
      origin: 'http://localhost:3000'
    }
  })

  // Tạo một đối tượng để lưu danh sách người dùng kết nối.
  // Key là `id` của người dùng, value là `socket_id` của socket.
  const users: {
    [key: string]: {
      socket_id: string
    }
  } = {}

  //middleware
  io.use(async (socket, next) => {
    try {
      const { Authorization } = socket.handshake.auth

      const access_token = Authorization?.split(' ')[1]
      if (!access_token) {
        throw new Error('🚨 Missing Authorization header')
      }

      const secretKey = envConfig.jwtSecretAccessToken

      const decoded_authorization = await verifyAccessToken(access_token, secretKey)

      const { verify_status } = decoded_authorization as TokenPayload

      if (verify_status !== UserVerifyStatus.Verified) {
        throw new Error('🚨 User not verified')
      }
      // Truyền decoded_authorization vào socket để sử dụng ở các middleware khác
      socket.handshake.auth.decoded_authorization = decoded_authorization
      socket.handshake.auth.access_token = access_token
      next()
    } catch (error) {
      next({
        message: 'Unauthorized',
        name: 'UnauthorizedError',
        data: error
      })
    }
  })

  // Lắng nghe sự kiện kết nối từ client.
  io.on('connection', (socket) => {
    console.log(`user ${socket.id} connected`)
    // Lấy `id` từ thông tin xác thực (auth) trong kết nối.
    const { id: user_id } = socket.handshake.auth.decoded_authorization as TokenPayload

    // Nếu `id` không tồn tại, ghi log lỗi và ngắt kết nối client.
    if (!user_id) {
      console.error('Missing user ID during connection')
      socket.disconnect()
      return
    }

    // Lưu thông tin `socket_id` của người dùng vào danh sách `users`.
    users[user_id] = {
      socket_id: socket.id
    }

    socket.on('error', (error) => {
      if (error.message === 'Unauthorized') {
        socket.disconnect()
      }
    })
    // Lắng nghe sự kiện `send_message` khi client gửi tin nhắn riêng.
    socket.on('send_message', async (data) => {
      const { receiver_id, sender_id, content } = data.payload
      // Tìm người nhận trong danh sách `users` dựa trên `data.to`.
      const receiver = users[receiver_id]

      // Nếu người nhận không tồn tại, ghi log lỗi và dừng xử lý.
      if (!receiver) {
        console.error(`Receiver not found: ${receiver_id}`)
        return
      }

      // Lấy `socket_id` của người nhận.
      const receiver_socket_id = receiver.socket_id

      const conversation = {
        content: content,
        sender_id: sender_id,
        receiver_id: receiver_id
      }

      //lưu tin nhắn vào database
      await db.Conversation.create(conversation)

      // Thông báo cho client nhận đến tin nhắn riêng.
      socket.to(receiver_socket_id).emit('receive_message', {
        payload: conversation
      })

      console.log(`Message from ${user_id} to ${receiver_id}: ${content}`)
    })

    socket.on('disconnect', () => {
      delete users[user_id]
      console.log(`User ${user_id} disconnected`)
    })
  })
}

export default initSocket

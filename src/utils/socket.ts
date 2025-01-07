import { Server as ServerHttp } from 'http'
import { Server } from 'socket.io'
import { UserVerifyStatus } from '~/constants/enums'
const db = require('../models')

// Tạo đối tượng lưu trữ người dùng
const users: { [key: string]: { socket_id: string } } = {}

// Middleware kiểm tra trạng thái xác thực của người dùng
const authenticateUser = async (socket: any, next: any) => {
  try {
    const { verify_status } = socket.handshake.auth as { verify_status: number }
    if (verify_status !== UserVerifyStatus.Verified) {
      throw new Error('🚨 User not verified')
    }
    next()
  } catch (error) {
    next({
      message: 'Unauthorized',
      name: 'UnauthorizedError',
      data: error
    })
  }
}

// Lưu người dùng vào danh sách
const addUser = (user_id: string, socket_id: string) => {
  users[user_id] = { socket_id }
  console.log(`User ${user_id} connected with socket_id: ${socket_id}`)
}

// Xóa người dùng khỏi danh sách khi ngắt kết nối
const removeUser = (user_id: string) => {
  delete users[user_id]
  console.log(`User ${user_id} disconnected`)
}

// Lưu tin nhắn vào database
const saveConversation = async (conversation: { content: string; sender_id: string; receiver_id: string }) => {
  await db.Conversation.create(conversation)
  console.log(
    `Message saved to DB from ${conversation.sender_id} to ${conversation.receiver_id}: ${conversation.content}`
  )
}

// Xử lý gửi tin nhắn
const handleSendMessage = async (socket: any, data: any) => {
  const { receiver_id, sender_id, content, createdAt } = data.payload
  const receiver = users[receiver_id]

  const conversation = { content, sender_id, receiver_id, createdAt }
  await saveConversation(conversation)

  // Nếu người nhận không kết nối, chỉ lưu tin nhắn vào DB
  if (!receiver) {
    console.log(`Receiver ${receiver_id} not connected, message saved to DB`)
    return
  }

  // Nếu người nhận kết nối, gửi tin nhắn ngay lập tức
  socket.to(receiver.socket_id).emit('receive_message', { payload: conversation })
  console.log(`Message from ${sender_id} to ${receiver_id}: ${content}`)
}

// Khởi tạo Socket.IO
const initSocket = (httpServer: ServerHttp) => {
  const io = new Server(httpServer, {
    cors: {
      origin: 'http://localhost:3000'
    }
  })

  // Sử dụng middleware để xác thực người dùng
  io.use(authenticateUser)

  // Lắng nghe sự kiện kết nối
  io.on('connection', (socket) => {
    const { user_id } = socket.handshake.auth as { user_id: string }

    // Kiểm tra nếu user_id không có trong kết nối
    if (!user_id) {
      console.error('Missing user ID during connection')
      socket.disconnect()
      return
    }

    // Thêm người dùng vào danh sách
    addUser(user_id, socket.id)

    // Lắng nghe sự kiện 'send_message'
    socket.on('send_message', (data) => handleSendMessage(socket, data))

    // Xử lý sự kiện ngắt kết nối
    socket.on('disconnect', () => removeUser(user_id))
  })
}

export default initSocket

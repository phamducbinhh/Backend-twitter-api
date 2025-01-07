import { Server as ServerHttp } from 'http'
import { Server } from 'socket.io'
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

  // Lắng nghe sự kiện kết nối từ client.
  io.on('connection', (socket) => {
    // Lấy `id` từ thông tin xác thực (auth) trong kết nối.
    const { id } = socket.handshake.auth as { id: string }

    // Nếu `id` không tồn tại, ghi log lỗi và ngắt kết nối client.
    if (!id) {
      console.error('Missing user ID during connection')
      socket.disconnect()
      return
    }

    // Lưu thông tin `socket_id` của người dùng vào danh sách `users`.
    users[id] = {
      socket_id: socket.id
    }

    console.log(`User connected: ${id}, socket_id: ${socket.id}`)

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

      console.log(`Message from ${id} to ${receiver_id}: ${content}`)
    })

    socket.on('disconnect', () => {
      delete users[id]
      console.log(`User ${id} disconnected`)
    })
  })
}

export default initSocket

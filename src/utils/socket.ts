import { Server as ServerHttp } from 'http'
import { Server } from 'socket.io'

const initSocket = (httpServer: ServerHttp) => {
  const io = new Server(httpServer, {
    cors: {
      origin: 'http://localhost:3000'
    }
  })

  const users: {
    [key: string]: {
      socket_id: string
    }
  } = {}

  io.on('connection', (socket) => {
    const { id } = socket.handshake.auth as { id: string }

    if (!id) {
      console.error('Missing user ID during connection')
      socket.disconnect()
      return
    }

    users[id] = {
      socket_id: socket.id
    }

    console.log(`User connected: ${id}, socket_id: ${socket.id}`)

    socket.on('private message', (data) => {
      const receiver = users[data.to]

      if (!receiver) {
        console.error(`Receiver not found: ${data.to}`)
        return
      }

      const receiver_socket_id = receiver.socket_id

      socket.to(receiver_socket_id).emit('receive private message', {
        content: data.content,
        sender: id,
        time: new Date().toLocaleTimeString()
      })

      console.log(`Message from ${id} to ${data.to}: ${data.content}`)
    })

    socket.on('disconnect', () => {
      delete users[id]
      console.log(`User ${id} disconnected`)
    })
  })
}

export default initSocket

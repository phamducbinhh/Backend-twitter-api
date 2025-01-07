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

    users[id] = {
      socket_id: socket.id
    }

    socket.on('private message', (data) => {
      const receiver_socket_id = users[data.to].socket_id

      socket.to(receiver_socket_id).emit('receive private message', {
        content: data.content,
        sender: id,
        time: new Date().toLocaleTimeString()
      })
    })

    socket.on('disconnect', () => {
      delete users[id]
      console.log(`user ${socket.id} disconnected`)
    })
  })
}

export default initSocket

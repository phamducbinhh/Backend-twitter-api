import { Server as ServerHttp } from 'http'
import { Server } from 'socket.io'

const initSocket = (httpServer: ServerHttp) => {
  const io = new Server(httpServer, {
    cors: {
      origin: 'http://localhost:3000'
    }
  })

  io.on('connection', (socket) => {
    console.log(`user ${socket.id} connected`)

    socket.on('message', (data) => {
      console.log(`data from client: ${data}`)
    })

    socket.emit('message', {
      data: 'Hello from server!'
    })

    socket.on('disconnect', () => {
      console.log(`user ${socket.id} disconnected`)
    })
  })
}

export default initSocket

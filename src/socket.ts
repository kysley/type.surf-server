import { Socket } from 'socket.io'
import lru from 'tiny-lru'
import { v4 as uuid } from 'uuid'

import { BaseController, PlayerConnection } from './controllers'
import { Standard } from './controllers/standard'
import { chunk } from './helpers'
import { app, io } from './server'

const queue: string[] = []
const rooms_global = lru<BaseController>()
export const players_global = lru<PlayerConnection>()

function createRoom(room: BaseController) {
  const roomController = new Standard({ ...room })
  rooms_global.set(room.id, roomController)
}

io.on('connection', (socket: Socket) => {
  console.log('incoming connection..')
  socket.on('client.whois', (userId: string) => {
    players_global.set(socket.id, { id: userId, username: 'Test' })
  })
})

app.post('/queue', (req) => {
  // socketid, userId?
  console.log(req.params)
  // players.set(req.params.socketId, { id: req.params?.userId, username: 'Test' })
  queue.push(req.params.socketId)
})

// simple matchmaking
setInterval(() => {
  // players are in the queue
  if (queue.length) {
    const chunks = chunk(queue, 4) // room size

    chunks.forEach((chunk) => {
      // const playerArray = chunk.map((socketId) => players_global.get(socketId))
      const roomId = uuid()
      createRoom({
        invitesEnabled: true,
        state: 'LOBBY',
        id: roomId,
        name: '',
        // players: playerArray,
      } as BaseController)
      const controller = rooms_global.get(roomId)!
      chunk.forEach((socketId) => controller.connectPlayer(socketId))
    })
  }
}, 5000)

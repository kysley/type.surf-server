import { Socket } from 'socket.io'
import lru from 'tiny-lru'

import { BaseController, Race } from './controllers/standard'
import { chunk } from './helpers'
import { setPlayerData, removePlayerData } from './redis'
import { io } from './server'

const queue: string[] = []
const rooms_global = lru<BaseController>()

export enum ROOM_TYPES {
  'RACE',
}

export const ROOM_MAP = {
  [ROOM_TYPES.RACE]: Race,
}

function roomFactory<T extends ROOM_TYPES>(
  type: T,
  constructor: ConstructorParameters<typeof ROOM_MAP[T]>[0],
) {
  const roomController = new ROOM_MAP[type](constructor)
  rooms_global.set(roomController.id, roomController)
  return roomController.id
}

rooms_global.set('123', new Race({ players: [] }))

io.on('connection', (socket: Socket) => {
  let room: string
  console.log(`incoming connection..${socket.id}`)
  socket.emit('server.whois')
  socket.on('client.whois', ({ userId, username }, callback) => {
    callback({
      status: 'ok!!!',
    })
    setPlayerData(socket.id, { id: userId, username })
    console.log(userId, username)
  })
  socket.on('client.response.*', ({ room, state }) => {})
  socket.on('client.queue', () => {
    queue.push(socket.id)
  })
  socket.on('client.join', ({ roomId }) => {
    if (rooms_global.has(roomId)) {
      // try-catch this?
      rooms_global.get(roomId)?.connectPlayer(socket.id)
      room = roomId
      console.log('joined' + roomId)
    }
  })

  socket.on('disconnect', () => {
    removePlayerData(socket.id)
    console.log(`lost connection...${socket.id}`)
  })
})

// simple matchmaking
setInterval(() => {
  // players are in the queue
  if (queue.length) {
    const chunks = chunk(queue, 4) // room size

    chunks.forEach((chunk) => {
      const id = roomFactory(0, {
        invitesEnabled: true,
        state: 'LOBBY',
        name: 'TEST LOBBY',
        players: [],
      })
      const controller = rooms_global.get(id)!
      chunk.forEach((socketId) => controller.connectPlayer(socketId))
    })
  }
}, 5000)

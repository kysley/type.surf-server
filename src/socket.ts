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

rooms_global.set('123', new Race({ length: 300 }))

io.on('connection', (socket: Socket) => {
  let room: string | undefined
  console.log(`incoming connection..${socket.id}`)

  socket.on('client.response.*', ({ room, state }) => {})

  socket.on('client.queue', () => {
    queue.push(socket.id)
  })

  socket.on('client.join', ({ roomId }, playerData) => {
    if (rooms_global.has(roomId)) {
      // try-catch this?
      rooms_global.get(roomId)?.connectPlayer(socket, playerData)
      room = roomId
      console.log('joined' + roomId)
    }
  })

  socket.on('client.leave', ({ roomId }, userId) => {
    console.log('player has left lobby')
    if (rooms_global.has(roomId)) {
      rooms_global.get(roomId)?.disconnectPlayer(socket.id)
      room = undefined
    }
  })

  socket.on('disconnect', async () => {
    removePlayerData(socket.id)
    if (room) {
      socket.leave(room)
      if (rooms_global.has(room)) {
        const signal = await rooms_global.get(room)?.disconnectPlayer(socket.id)
        if (signal) {
          rooms_global.delete(room)
        }
        room = undefined
      }
    }
    console.log(`lost connection...${socket.id}`)
  })
})

// rethink this because we need to connect with a socket object
// setInterval(() => {
//   // players are in the queue
//   if (queue.length) {
//     const chunks = chunk(queue, 4) // room size

//     chunks.forEach((chunk) => {
//       const id = roomFactory(0, {
//         invitesEnabled: true,
//         state: 'LOBBY',
//         name: 'TEST LOBBY',
//         length: 300,
//       })
//       const controller = rooms_global.get(id)!
//       chunk.forEach((socketId) => controller.connectPlayer(socket))
//     })
//   }
// }, 5000)

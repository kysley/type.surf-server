import { Socket } from 'socket.io'
import lru from 'tiny-lru'

import { Modes } from '../types'
import { BaseController, Race } from './controllers/standard'
import { io } from './server'

const queue: Socket[] = []
const rooms_global = lru<BaseController>()

export const ROOM_MAP = {
  [Modes.CIRCUIT]: Race,
}

// function roomFactory<T extends Modes>(
//   type: T,
//   constructor: ConstructorParameters<typeof ROOM_MAP["RACE"]>,
// ) {
//   const roomController = new ROOM_MAP[type](constructor)
//   rooms_global.set(roomController.id, roomController)
//   return roomController.id
// }

rooms_global.set('123', new Race({ length: 300 }))

io.on('connection', (socket: Socket) => {
  let room: string | undefined
  let identity: any
  console.log(`incoming connection..${socket.id}`)

  socket.on('client.response.*', ({ room, state }) => {})

  socket.on('client.ready', (isReady) => {
    if (room && rooms_global.has(room)) {
      rooms_global.get(room)!.readyCheck(isReady, identity.userId)
    }
  })

  socket.on('client.queue', (mode) => {
    // queue.push(socket)
    // let exit = false
    rooms_global.keys().forEach((key) => {
      // if (!exit) {
      const roomObj = rooms_global.get(key)
      if (
        roomObj?.mode === mode &&
        (roomObj?.state === 'STARTING' || roomObj?.state === 'LOBBY')
      ) {
        roomObj.connectPlayer(socket, identity)
        room = roomObj.id
        console.log('joined' + roomObj.id)
        return
        // exit = true
      }
      // }
    })
    const newRoom = new Race({})
    rooms_global.set(newRoom.id, newRoom)
    newRoom.connectPlayer(socket, identity)
    room = newRoom.id
  })

  socket.on('client.stats', (stats) => {
    rooms_global.get(room!)?.ack(stats, identity?.userId)
  })

  socket.on('client.identity', (newIdentity) => {
    console.log('new identity', newIdentity)
    identity = newIdentity
    if (room) {
      rooms_global.get(room)?.ack(newIdentity, identity?.userId)
    }
  })

  socket.on('client.join', (roomId) => {
    if (!identity) {
      socket.emit('server.retry', roomId)
      return
    }
    if (rooms_global.has(roomId)) {
      // try-catch this?
      rooms_global.get(roomId)?.connectPlayer(socket, identity)
      room = roomId
      console.log('joined' + roomId)
    }
  })

  socket.on('client.leave', (roomId) => {
    console.log('player has left lobby')
    if (rooms_global.has(roomId)) {
      rooms_global.get(roomId)?.disconnectPlayer(identity?.userId)
      room = undefined
    }
  })

  socket.on('disconnect', async () => {
    // removePlayerData(socket.id)
    if (room) {
      socket.leave(room)
      if (rooms_global.has(room)) {
        const signal = rooms_global
          .get(room)
          ?.disconnectPlayer(identity?.userId)
        if (signal) {
          rooms_global.delete(room)
          // roomFactory(0, { length: 300 })
        }
      }
      room = undefined
    }
    console.log(`lost connection...${socket.id}`)
  })
})

// setInterval(() => {
//   if (queue.length) {
//     const chunks = chunk(queue, 4)

//     chunks.forEach((chunk) => {
//       // const id = roomFactory(0, {
//       //   length: 300,
//       // })
//     })
//   }
// }, 1000)

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

import http from 'http'
import socketIO from 'socket.io'

import { express } from './server'

export const socketHttpServer = http.createServer(express)

export const io = socketIO(socketHttpServer)

// socketHttpServer.listen(3001, async () => {
//   console.log('Sawkets Listening on 3001')
// })

// import { server } from 'nexus'

// export const socketServer = http.createServer(server.raw.http.).listen(4005, () => {
//   console.log('go to http://localhost:3000')
// })

// export const socketServer = server.raw.http

// export const io = new socketServ(3001)

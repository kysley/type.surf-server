import dotenv from 'dotenv'
import { ApolloServer } from 'apollo-server-express'
import createExpress from 'express'
import http from 'http'
import socketIO from 'socket.io'

dotenv.config()

import { schema } from './schema'
import { prisma } from './context'
import { getCurrentUser } from './auth'

// import { socketHttpServer } from './socket'

const apollo = new ApolloServer({
  schema,
  context: ({ req }) => ({ db: prisma, user: getCurrentUser(req) }),
})

export const express = createExpress()

// application.use(cors())

export const socketHttpServer = http.createServer(express).listen(8086)

export const io = socketIO(socketHttpServer)

apollo.applyMiddleware({
  app: express,
  cors: { origin: ['http://localhost:8080'], credentials: true },
  path: '/graphql',
})

express.listen(8081, () => {
  console.log(`🚀 GraphQL service ready at http://localhost:8081/graphql`)
})

// express.listen(4000, () => {
//   console.log(`🚀 GraphQL service ready at http://localhost:4000/graphql`)
// })

// socketHttpServer.listen(4005, () => {
//   console.log(`🚀 Socket connect to http://localhost:3001`)
// })

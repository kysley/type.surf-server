import dotenv from 'dotenv'
import { ApolloServer } from 'apollo-server-express'
import express from 'express'
import http from 'http'
import { Server, Socket } from 'socket.io'

dotenv.config()

import { schema } from './schema'
import { prisma } from './context'
import { getCurrentUser } from './auth'

const apollo = new ApolloServer({
  schema,
  context: ({ req }) => ({ db: prisma, user: getCurrentUser(req) }),
})

export const app = express()

export const server = http.createServer(express)
server.listen(8086, () => {
  console.log('socket 8086')
})

export const io = new Server(server)

apollo.applyMiddleware({
  app,
  cors: { origin: ['http://localhost:8080'], credentials: true },
  path: '/graphql',
})

app.listen(8081, () => {
  console.log(`🚀 GraphQL service ready at http://localhost:8081/graphql`)
})

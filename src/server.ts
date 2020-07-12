import * as dotenv from 'dotenv'
dotenv.config()
import { prisma } from 'nexus-plugin-prisma'
import { server, use } from 'nexus'
import * as cors from 'cors'
import * as http from 'http'

import { prisma as pc } from './context'

export const socketServer = http.createServer(server.express).listen(8088)

use(prisma({ client: { instance: pc }, features: { crud: true } }))
server.express.use(
  cors({
    origin: ['http://localhost:8080'],
  }),
)
// use(auth({ appSecret: process.env.APP_SECRET! }))

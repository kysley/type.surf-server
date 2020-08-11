import * as dotenv from 'dotenv'
dotenv.config()
import { prisma } from 'nexus-plugin-prisma'
import { server, use } from 'nexus'
import * as cors from 'cors'

import './socket'

import { prisma as pc } from './context'

use(prisma({ client: { instance: pc }, features: { crud: true } }))
server.express.use(
  cors({
    origin: ['http://localhost:8080'],
  }),
)

import * as dotenv from 'dotenv'
dotenv.config()
import { ApolloServer } from 'apollo-server-express'
import { auth } from 'nexus-plugin-jwt-auth'
import { prisma } from 'nexus-plugin-prisma'
import { server, use } from 'nexus'

import { prisma as pc } from './context'
use(prisma({ client: { instance: pc } }))
// use(auth({ appSecret: process.env.APP_SECRET! }))

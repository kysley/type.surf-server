import { PrismaClient } from '@prisma/client'
import { ExpressContext } from 'apollo-server-express/dist/ApolloServer'
import { schema } from 'nexus'
import { Request } from 'nexus/dist/runtime/schema/schema'

import { getUserContext } from './auth'

export const prisma = new PrismaClient({ log: ['query', 'info', 'warn'] })

schema.addToContext((req) => {
  return {
    ...createContext(req),
  }
})

export type UserDetail = {
  id: string
}

export type UserContext = {
  getCurrentUser: () => Promise<UserDetail>
}

export interface Context {
  user: UserContext
}

export function createContext(contextParameters: Request): Context {
  return { user: getUserContext(contextParameters) }
}
// export function getUserId(token: any | null | undefined) {
//   const id = token?.id

//   if (!id) {
//     throw Error('Not Authorized.')
//   }

//   return id
// }

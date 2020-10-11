import { PrismaClient } from '@prisma/client'

import { getCurrentUser } from './auth'

export const prisma = new PrismaClient({ log: ['query', 'info', 'warn'] })

// export type UserDetail = {
//   id: string
// }

// export type UserContext = {
//   getCurrentUser: () => Promise<UserDetail>
// }

// export interface Context {
//   user: UserContext
// }

// export function createContext(contextParameters: Request): Context {
//   return { user: getUserContext(contextParameters) }
// }
// export function getUserId(token: any | null | undefined) {
//   const id = token?.id

//   if (!id) {
//     throw Error('Not Authorized.')
//   }

//   return id
// }

export type Context = {
  db: PrismaClient
  user: ReturnType<typeof getCurrentUser>
}

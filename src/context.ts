import { PrismaClient } from '@prisma/client'
import { Redis } from 'ioredis'
import { verify } from 'jsonwebtoken'

import { redis } from './redis'

export const prisma = new PrismaClient({ log: ['query', 'info', 'warn'] })

export type Context = {
  prisma: PrismaClient
  userId: string
  redis: Redis
}

export type Token = {
  id: string
}

export const createContext = (ctx: any): Context => {
  let userId: string
  try {
    let Authorization = ''
    try {
      Authorization = ctx.req.get('authorization')
    } catch (e) {
      Authorization = ctx?.connection?.context?.Authorization
    }
    const token = Authorization.replace('Bearer ', '')
    const verifiedToken = verify(token, process.env.APP_SECRET!) as Token

    if (!verifiedToken.id) {
      userId = '-1'
    } else {
      userId = verifiedToken.id
    }
  } catch (e) {
    console.log(e)
    userId = '-1'
  }
  return {
    prisma,
    redis,
    userId,
  }
}

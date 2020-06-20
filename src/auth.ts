import * as jwt from 'jsonwebtoken'
import { Request } from 'nexus/dist/runtime/schema/schema'

import { UserContext, UserDetail } from './context'

export const issueToken = (userDetails: UserDetail): string => {
  if (!process.env.APP_SECRET) {
    throw new Error('No client secret provided in ENV.')
  }
  return jwt.sign(userDetails, process.env.APP_SECRET, {
    expiresIn: 43200, // expires in 12 hours
  })
}

const getCurrentUserByToken = (token: string | undefined) =>
  new Promise<UserDetail>((resolve, reject) => {
    if (!process.env.APP_SECRET) {
      throw new Error('No client secret provided in ENV.')
    }
    if (!token) {
      throw new Error('No token provided')
    }
    jwt.verify(token, process.env.APP_SECRET, (err, decoded) => {
      if (err || !decoded) {
        return reject(err)
      }

      const userDetails = decoded as UserDetail
      resolve(userDetails)
    })
  })

export const getUserContext = (req: Request): UserContext => {
  let token: string | undefined = undefined
  const auth = req.headers.authorization
  if (auth) {
    token = auth.replace('Bearer ', '')
  }

  return { getCurrentUser: () => getCurrentUserByToken(token) }
}

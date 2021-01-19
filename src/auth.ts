import { Request } from 'express'
import jwt from 'jsonwebtoken'

type UserToken = {
  id: string
}

export const issueToken = (userDetails: UserToken): string => {
  if (!process.env.APP_SECRET) {
    throw new Error('No client secret provided in ENV.')
  }
  return jwt.sign(userDetails, process.env.APP_SECRET, {
    expiresIn: 43200, // expires in 12 hours
  })
}

const getCurrentUserByToken = (token: string | undefined) =>
  new Promise<UserToken>((resolve, reject) => {
    if (!process.env.APP_SECRET) {
      throw new Error('No client secret provided in ENV.')
    }
    if (!token) {
      return resolve({ id: undefined } as any)
    }
    jwt.verify(token, process.env.APP_SECRET, (err, decoded) => {
      if (err || !decoded) {
        return reject(err)
      }

      const userDetails = decoded as UserToken
      resolve(userDetails)
    })
  })

export const getCurrentUser = async (req: Request) => {
  let token: string | undefined = undefined
  const auth = req.headers.authorization

  if (auth) {
    token = auth.replace('Bearer ', '')
  }

  const currentUser = await getCurrentUserByToken(token)

  return currentUser

  // return { getCurrentUser: () => getCurrentUserByToken(token) }
}

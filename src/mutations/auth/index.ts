import { mutationField, mutationType, stringArg } from 'nexus'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

// export const CreateAccount
mutationType({
  definition(t) {
    t.field('createAccount', {
      type: 'AuthPayload',
      args: {
        email: stringArg(),
        password: stringArg(),
        username: stringArg(),
      },
      resolve: async (parent, args, ctx) => {
        const $exists = await ctx.db.account.findMany({
          where: {
            OR: [
              {
                usernameLowercase: args.username.toLowerCase(),
              },
              {
                email: args.email.toLowerCase(),
              },
            ],
          },
        })
        if ($exists.length !== 0) {
          throw new Error('Email or Username already Taken.')
        }

        const password = await bcrypt.hash(args.password, 10)
        const usernameLowercase = args.username.toLowerCase()
        const emailLowercase = args.email.toLowerCase()

        const account = await ctx.db.account.create({
          data: {
            username: args.username,
            usernameLowercase,
            role: 'USER',
            rank: 'Novice',
            digits: 0o0123,
            lastSeen: new Date().toISOString(),
            email: emailLowercase,
            password,
          },
        })

        return {
          token: jwt.sign({ id: account.id }, process.env.APP_SECRET!),
          account,
        }
      },
    })
  },
})

export const Login = mutationField('login', {
  type: 'AuthPayload',
  args: {
    username: stringArg(),
    password: stringArg(),
  },
  resolve: async (parent, args, ctx) => {
    const $account = await ctx.db.account.findOne({
      where: { usernameLowercase: args.username.toLowerCase() },
    })

    if (!$account) {
      throw new Error(
        `Cannot find account associated with the username: ${args.username}`,
      )
    }

    const $valid = await bcrypt.compare(args.password, $account.password)

    if (!$valid) {
      throw new Error('Invalid Username or Password')
    }

    return {
      token: jwt.sign({ id: $account.id }, process.env.APP_SECRET!),
      account: $account,
    }
  },
})

// schema.extendType({
//   type: 'Mutation',
//   definition(t) {
//     t.field('loginWithDiscord', {
//       type: 'AuthPayload',
//     })
//   },
// })

import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import {
  booleanArg,
  idArg,
  intArg,
  mutationField,
  stringArg,
  arg,
  nonNull,
} from 'nexus'
import { seed, grabWords } from 'wordkit'
import got from 'got'

import { redis } from '../redis'

// export const CreateAccount = mutationField('createAccount', {
//   type: 'AuthPayload',
//   args: {
//     email: stringArg(),
//     password: stringArg(),
//     username: stringArg(),
//   },
//   resolve: async (parent, args, ctx) => {
//     const $exists = await ctx.db.account.findFirst({
//       where: {
//         OR: [
//           {
//             // usernameLowercase: args.username.toLowerCase(),
//             username: {
//               equals: args.username,
//               mode: 'insensitive',
//             },
//           },
//           {
//             // email: args.email.toLowerCase(),
//             email: {
//               equals: args.email,
//               mode: 'insensitive',
//             },
//           },
//         ],
//       },
//     })
//     if ($exists) {
//       throw new Error('Email or Username already Taken.')
//     }

//     const password = await bcrypt.hash(args.password, 10)
//     const emailLowercase = args.email.toLowerCase()

//     const account = await ctx.db.account.create({
//       data: {
//         username: args.username,
//         role: 'USER',
//         rank: 'Novice',
//         tag: 0o0123,
//         lastSeen: new Date().toISOString(),
//         email: emailLowercase,
//         password,
//       },
//     })

//     return {
//       token: jwt.sign({ id: account.id }, process.env.APP_SECRET!),
//       account,
//     }
//   },
// })
export const RegisterWithDiscord = mutationField('RegisterWithDiscord', {
  type: 'AuthPayload',
  args: {
    access: nonNull(stringArg()),
    type: nonNull(stringArg()),
  },
  resolve: async (parent, args, ctx) => {
    const r = await got('https://discord.com/api/v6/users/@me', {
      headers: {
        authorization: `${args.type} ${args.access}`,
      },
    }).json()

    console.log(r)
    const { email, username, discriminator, id } = r as any

    const $exists = await ctx.prisma.account.findUnique({
      where: {
        // email,
        username_discriminator: {
          username,
          discriminator,
        },
      },
    })
    if (!$exists) {
      const account = await ctx.prisma.account.create({
        data: {
          discriminator,
          email,
          username,
          discordId: id,
          confirmed: true,
        },
      })
      return {
        token: jwt.sign({ id: account.id }, process.env.APP_SECRET!),
        account,
      }
    } else {
      return {
        token: jwt.sign({ id: $exists.id }, process.env.APP_SECRET!),
        account: $exists,
      }
    }
  },
})

// export const Login = mutationField('login', {
//   type: 'AuthPayload',
//   args: {
//     username: stringArg(),
//     password: stringArg(),
//   },
//   resolve: async (parent, args, ctx) => {
//     const $account = await ctx.db.account.findFirst({
//       where: {
//         username: { equals: args.username, mode: 'insensitive' },
//       },
//     })

//     if (!$account) {
//       throw new Error(
//         `Cannot find account associated with the username: ${args.username}`,
//       )
//     }

//     const $valid = await bcrypt.compare(args.password, $account.password)

//     if (!$valid) {
//       throw new Error('Invalid Username or Password')
//     }

//     return {
//       token: jwt.sign({ id: $account.id }, process.env.APP_SECRET!),
//       account: $account,
//     }
//   },
// })

// export const Wordset = mutationField('wordset', {
//   type: 'String',
//   args: {
//     count: intArg(),
//     seed: stringArg(),
//     punctuate: booleanArg({ default: false }),
//   },
//   resolve: async (parent, args, ctx) => {
//     const seededArray = new seed({ seed: args?.seed || undefined }).nRandom(
//       args.count,
//     )
//     const set = grabWords(seededArray, { punctuate: args?.punctuate || false })
//     const { id } = await ctx.user
//     if (id) {
//       await redis.set(id, set, 'ex', 60 * 5) // 5 mins
//     }
//     return set
//   },
// })

// export const CreateResult = mutationField('createResult', {
//   type: 'Boolean',
//   args: {
//     mapId: idArg(),
//     data: arg({ type: 'ResultInput' }),
//   },
//   resolve: async (parent, args, ctx) => {
//     const id = await ctx.user
//     const result = await ctx.db.result.create({
//       data: {
//         ...args.data,
//         mode: args.data.mode,
//         mods: {
//           set: args.data.mods || [],
//         },
//         account: {
//           connect: {
//             id: id.id,
//           },
//         },
//       },
//     })

//     return true
//   },
// })

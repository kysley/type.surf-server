import { schema } from 'nexus'
import * as bcrypt from 'bcrypt'
import * as jwt from 'jsonwebtoken'

schema.objectType({
  name: 'Account',
  definition(t) {
    t.model.id()
    t.model.username()
    t.model.color()
    t.model.confirmed()
    t.model.email()
    t.model.lastSeen()
  },
})

schema.objectType({
  name: 'AuthPayload',
  definition(t) {
    t.string('token'), t.field('account', { type: 'Account' })
  },
})

schema.queryType({
  definition(t) {
    t.field('me', {
      type: 'Account',
      nullable: true,
      resolve: async (parent, args, ctx) => {
        const { id } = await ctx.user.getCurrentUser()
        // console.log(id.id)
        return ctx.db.account.findOne({ where: { id } })
        // return { id: '1' }
      },
    })
  },
})

schema.mutationType({
  definition(t) {
    t.field('createAccount', {
      type: 'AuthPayload',
      nullable: false,
      args: {
        email: schema.stringArg({ nullable: false }),
        password: schema.stringArg({ nullable: false }),
        username: schema.stringArg({ nullable: false }),
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

schema.extendType({
  type: 'Mutation',
  definition(t) {
    t.field('login', {
      type: 'AuthPayload',
      args: {
        username: schema.stringArg({ nullable: false }),
        password: schema.stringArg({ nullable: false }),
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
  },
})
// schema.mutationType({
//   definition(t) {
//     t.field('login', {
//       type: 'AuthPayload',
//       args: {
//         username: schema.stringArg(),
//         password: schema.stringArg(),
//       },
//     })
//   },
// })

import { schema } from 'nexus'
import { generate } from '@typvp/gen'
import { redis } from '../redis'

schema.extendType({
  type: 'Mutation',
  definition(t) {
    t.field('wordset', {
      type: 'String',
      args: {
        length: schema.intArg({ default: 250 }),
      },
      resolve: async (parent, args, ctx) => {
        //@ts-ignore
        const set = generate(args?.length, {
          minLength: 3,
          maxLength: 8,
          join: '|',
        }) as string
        const { id } = await ctx.user.getCurrentUser()
        if (id) {
          await redis.set(id, set, 'ex', 60 * 5) // 5 mins
        }
        return set
      },
    })
  },
})

import { schema } from 'nexus'
import { generate } from '@typvp/gen'

schema.extendType({
  type: 'Query',
  definition(t) {
    t.field('wordset', {
      type: 'String',
      args: {
        length: schema.intArg({ default: 250 }),
      },
      resolve: async (parent, args, ctx) => {
        const set = generate(length, {})
      },
    })
  },
})

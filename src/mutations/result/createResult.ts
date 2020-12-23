import { schema } from 'nexus'

// t.model.correct()
// t.model.corrections()
// t.model.cpm()
// t.model.createdAt()
// t.model.id()
// t.model.incorrect()
// t.model.rawCpm()
// t.model.mode()
// t.model.mods()
// t.model.wordIndex()
// t.model.wpm()
// t.model.map()
// t.model.account()
export const ResultInput = schema.inputObjectType({
  name: 'ResultInput',
  definition(t) {
    t.int('correct')
    t.int('corrections')
    t.int('cpm')
    t.int('incorrect')
    t.int('rawCpm')
    t.list.field('mods', { type: 'Mods' })
    t.field('mode', { type: 'Mode', nullable: false })
    t.int('wordIndex')
    t.int('wpm')
  },
})

schema.extendType({
  type: 'Mutation',
  definition(t) {
    t.field('createResult', {
      type: 'Result',
      args: {
        mapId: schema.idArg(),
        data: schema.arg({ type: ResultInput, nullable: false }),
      },
      resolve: async (parent, args, ctx) => {
        const { id } = await ctx.user.getCurrentUser()
        const result = await ctx.db.result.create({
          data: {
            ...args.data,
            mods: {
              set: args.data.mods,
            },
            mode: args.data.mode,
            account: {
              connect: {
                id,
              },
            },
          },
        })
        return result
      },
    })
  },
})
